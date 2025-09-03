import { Cardapio } from './lib.js';

// chamando as funções com os botoes
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar event listener ao botão
    document.getElementById('btnSalvar').addEventListener('click', salvarComida);
    document.getElementById('btnRemover').addEventListener('click', removerComida);
    document.getElementById('form-search-food').addEventListener('submit', comidaEspecifica);
    document.getElementById("btnResetFoods").addEventListener("click", confirmarReset);
});

document.addEventListener('DOMContentLoaded', () => {

    // ======================================
    // Seção 1: Lógica Para Navegação na Página
    // ======================================

    // Seleciona todos os botões de navegação da nossa página
    const navButtons = Array.from(document.querySelectorAll('.nav-button'));
    // Aqui seleciona todas as seções de conteúdo da página
    const pageContents = Array.from(document.querySelectorAll('.page-content'));

    // Ela recebe o ID da página de destino e retorna um novo array de objetos
    // Para conseguir indicar qual página deve estar ativa.
    // Basicamente ta puxando o Id no HTML para poder identificar qual botão vai funcionar
    const getNewActiveState = (targetId) => {
        return pageContents.map(page => ({
            id: page.id,
            isActive: page.id === targetId // Retorna true se a página atual é a de destino.
        }));
    };

    // Aqui serve  para mostrar a página correta e destacar o botão correspondente que está sendo usado/clicado
    const applyStateToDOM = (state, buttons, pages) => {
        // Aqui ele vai apagar o botão e depois limpar a tela.
        buttons.forEach(btn => btn.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active-page'));
        
        // Encontra o ID da página que deve ser ativada.
        const activePageId = state.find(s => s.isActive).id;
        // Encontra o botão e a página que vai estar correspondendo ao ID
        const targetButton = buttons.find(btn => btn.dataset.page === activePageId);
        const targetPage = pages.find(page => page.id === activePageId);

        // Adiciona a classe 'active' ou 'active-page' aos botões corretos
        // Isso vai destacar eles mais do que os outros botões
        if (targetButton) {
            targetButton.classList.add('active');
        }
        if (targetPage) {
            targetPage.classList.add('active-page');
        }
    };

    // Adiciona um "ouvinte de evento de clique" a cada botão
    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Pega o ID da página que está no 'data-page' do botão que foi escolhido
            const targetId = event.currentTarget.dataset.page;
            
            // Vai calcular o novo estado da navegação.
            const newState = getNewActiveState(targetId);

            // Aplica o novo estado ao HTML (ao DOM).
            applyStateToDOM(newState, navButtons, pageContents);

             if (targetId === 'food-list') {
            renderFoods();
        }    else if(targetId === 'diet-plan'){
            renderDiet();
        }
        else if(targetId === 'home'){
            //atualiza os 2 graficos
            chart.updateSeries(somacaltotal());
            const novaSerieBarras = [{
                name: 'Quantidade', // Garanta que a estrutura é a mesma da inicialização
                data: [{
                    x: 'Proteinas',
                    y: numerodealimentos('proteinas')
                }, {
                    x: 'Carboidratos',
                    y: numerodealimentos('carboidratos')
                }, {
                    x: 'Gorduras',
                    y: numerodealimentos('gorduras')
                }]
            }];
            chart2.updateSeries(novaSerieBarras);
        }
        });
    });
})

    // ======================================
    // Seção 2: Lógica Para Adição de Alimentos
    // ======================================
    
    // Pega os valores dos campos do formulário e cria um objeto com eles.
    // O ID vai ser usado como argumento, já que ele é único, não corre o risco de ser passado um alimento errado q tenha o mesmo nome.
    const askFoodData = (id) => ({
      id: id,
      name: document.getElementById('name').value,
      // Vai converter as strings dos inputs para números decimais.
      // O '.replace' garante que a vírgula (,) seja substituída por ponto (.)
      carbs: parseFloat(document.getElementById('carb').value.replace(',', '.')),
      protein: parseFloat(document.getElementById('prot').value.replace(',', '.')),
      fat: parseFloat(document.getElementById('gord').value.replace(',', '.')),
      calories: parseFloat(document.getElementById('cal').value.replace(',', '.')),
    });
    
    // Aqui é a função princial que vai fazer funcionar o adicionar alimentos quando o nome do alimento for enviado.
    const salvarComida = (event) => {
        // Previne que a página seja recarregada e as mudanças feitas sejam perdidas
        event.preventDefault();

        // Carrega a lista de alimentos do local storage
        const currentFoods = Cardapio.loadFoods();

        // Aqui ele vai calcular um Id novo, se não tiver nenhum id, o primeiro elemento da lista ganha um id 1 e os outros...
        // Vão sendo somados até chegar no último ID. Do mesmo jeito, se já tiver um Id, ele vai no maior e o próximo alimento vai...
        // Ter o id do maior + 1
        const nextId = currentFoods.length > 0 ? Math.max(...currentFoods.map(food => food.id)) + 1 : 1;

        // Pega os dados do alimento que foi passado e cria um novo objeto de alimento,
        // Para isso é usado o id do alimento
         const novoAlimento = askFoodData(nextId);

        // Usa a função `addFood` da lib para adicionar o novo alimento na lista
        const updatedFoods = Cardapio.addFood(currentFoods, novoAlimento);
        
        // Usa a função `saveFoods` da lib para salvar a lista
        // E por fim, é atualizado o localStorage.
        Cardapio.saveFoods(updatedFoods);
        
        alert(`O alimento foi adicionado com sucesso!!`)
        
        // Chamar para quando for adicionado um item e manter a lista atualizada em tempo real
        renderFoods()
    };

    // ======================================
    // Seção 3: Lógica da Lista de Alimentos
    // ======================================

    // Essa parte será para chamar a função de Listar Alimentos

    const renderFoods = () => {
    // Vai servir para carregar todas as comidas que há na lista, ou seja, as que estão no Local Storage
    const loadedFoods = Cardapio.loadFoods();
    const allFoods = loadedFoods.length === 0 ? Cardapio.resetFoods() : loadedFoods;

    // Chamar a 'listFoods' para cada um dos filtros que foi aplicado
    const [proteinFoods, cabrsFoods, fatFoods] = Cardapio.listFood(allFoods);

    // Aqui serve para obter a referência aos elementos que estão no HTML pelo seu id
    const proteinList = document.getElementById('protein-list');
    const carbList = document.getElementById('carbs-list');
    const fatList = document.getElementById('fat-list');

    // Limpar listas antes de renderizar (evita duplicatas)
    proteinList.innerHTML = '';
    carbList.innerHTML = '';
    fatList.innerHTML = '';

    // Função auxiliar para criar item da lista
    const createListItem = (food) => {
    const li = document.createElement('li');
    li.textContent = `${food.name} (P: ${food.protein}g, C: ${food.carbs}g, G: ${food.fat}g, Kcal: ${food.calories} cal) `;

    // Criar botão de deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-food';
    deleteBtn.id = `delete-food-${food.id}`; // opcional, só se quiser controlar por id
    const fooddel = Cardapio.loadFoods()
    // Adicionar evento de clique diretamente
    deleteBtn.addEventListener('click', () => {
       const newListDel = Cardapio.deleteFood(fooddel,food.name)
        if(newListDel.length < fooddel.length) {
            // Salva a nova lista no Local Storage se a remoção funcionar
            Cardapio.saveFoods(newListDel);
           Toastify({
    text: `${food.name} removido com sucesso!`,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "white",
    style: {
        color: "red",      // muda a cor do texto
        fontWeight: "bold",  // pode estilizar também
    }
}).showToast();
            renderFoods(); // Vai renderizar a lista de novo
        } else {
            alert(`O alimento "${food.name}" não foi encontrado na lista.`)
        }
    });

    // Colocar botão dentro do <li>
    li.appendChild(deleteBtn);

    return li;
};

    // Adicionar itens ao HTML
    proteinFoods.forEach(food => proteinList.appendChild(createListItem(food)));
    cabrsFoods.forEach(food => carbList.appendChild(createListItem(food)));
    fatFoods.forEach(food => fatList.appendChild(createListItem(food)));
};

    // Inicia a renderização quando a página abrir
    renderFoods()
     
    
     // ======================================
     // Seção 4: Lógica para Excluir Alimentos
     // ======================================

     // Essa parte servirá para esperar que seja enviado o nome de um alimento para a parte de exclusão
     
     const removerComida = (event) => { 
        event.preventDefault(); // Isso está servindo para evitar que a página seja reccaregada quando o item for removido

        // Essa parte está evitando que nomes digitados errados por espaçamento sejam desconsiderados. O "trim" corrige esse erro
        const nameToRemove = document.getElementById('campo-excluir').value.trim();

        if (!nameToRemove) { // Serve para quando o usuário clicar em excluir sem digitar nada
            alert("Por Favor, digite o nome do alimento que irá ser excluido.")
            return;
        }

        const presentFoods = Cardapio.loadFoods() // Estou puxando a lista de alimentos
        
        // Essa parte irá filtrar a lista, pois irá usar a função para remover o alimento selecionado
        const newList = Cardapio.deleteFood(presentFoods,nameToRemove)
        if(newList.length <presentFoods.length) {
            // Salva a nova lista no Local Storage se a remoção funcionar
            Cardapio.saveFoods(newList);
            alert(`O alimento ${nameToRemove} foi removido com sucesso!!`)
            document.getElementById('campo-excluir').value = '' // Serve para limpar o campo
            renderFoods(); // Vai renderizar a lista de novo
        } else {
            alert(`O alimento "${nameToRemove}" não foi encontrado na lista.`)
        }

     }

     // ==========================================================
     // Seção 5: Lógica de Informação Específica sobre um alimento
     // ==========================================================

     const comidaEspecifica = (event) =>{
       event.preventDefault(); // Mesma ideia dos outros, evita que a página seja recarregada
            
        //está pegando o valor do input de busca no HTML
        const searchFood = document.getElementById('input-search-food').value.trim();
        if (!searchFood) { // Caso a pessoa clique em procurar sem digitar nenhum nome
            alert('Por favor, digite o nome de um alimento.')
            return;
        }
    
        // Essa parte está puxando os elementos presentes na lista
        const presentFoods = Cardapio.loadFoods()
            
        //Essa parte serve para que, após o usuário diga o alimento, ele seja buscado na lista
        // Ele está pegando o primeiro resultado que for encontrado
        const foundFood = Cardapio.listSpecificFood(presentFoods,searchFood)
    
        //Aqui ele irá pegar a parte onde o resultado é exibido
        const infContainer = document.getElementById('food-details-container');
            infContainer.innerHTML = '' // Essa parte serve para limpar o resultado
    
        // Aqui que acontece a exibição do alimento.
        if(foundFood.length === 0) { // Ele vai percorrer a lista e verificar se há o alimento. Caso não haja, ele devolve o alerta
            alert(`O alimento ${searchFood} não foi encontrado.`)
            return;
        } else { // Aqui será criada uma lista com o nome e as características do alimento.
            const createListItem = (food) => {
            const li = document.createElement('li');
            li.textContent = `${food.name} (P: ${food.protein}g, C: ${food.carbs}g, G: ${food.fat}g, Kcal: ${food.calories} cal) `;
            return li
        } // essa parte que está responsável por fazer o nome do alimento buscado e as características dele aparecerem na tela
        foundFood.forEach(food => infContainer.appendChild(createListItem(food)))
        }
  
}
    
    //===========================================
     // Seção 6: Lógica para o Reset dos Alimentos
     // ==========================================
     
     function confirmarReset() {
     if (confirm("Tem certeza que deseja resetar a lista de alimentos para os valores originais?")) {
        Cardapio.resetFoods();
        alert("Lista de alimentos foi resetada com sucesso!");
        renderFoods(); // Atualiza a lista na tela
        }
    }

     // ======================================
     // Seção 7: Lógica para Adicionar Refeições
     // ======================================

    // verifica qual radio esta marcado
     let refeicaoSelecionada = 'cafe-da-manha';

    document.querySelectorAll('input[name="refeicao"]').forEach(radio => {
    radio.addEventListener('change', () => {
        refeicaoSelecionada = radio.value;
        console.log('Alterou para:', refeicaoSelecionada);
    });
    });


     const renderFoodsAdd = () => {
    const loadedFoods = Cardapio.loadFoods();
    const allFoods = loadedFoods.length === 0 ? Cardapio.resetFoods() : loadedFoods;
    const [proteinFoods, carbsFoods, fatFoods] = Cardapio.listFood(allFoods);

    const proteinListDiet = document.getElementById('protein-list-diet');
    const carbListDiet = document.getElementById('carbs-list-diet');
    const fatListDiet = document.getElementById('fat-list-diet');

    // Limpar listas
    proteinListDiet.innerHTML = '';
    carbListDiet.innerHTML = '';
    fatListDiet.innerHTML = '';

    const createAddItem = (food) => {
        const li = document.createElement('li');
        li.textContent = `${food.name} (P: ${food.protein}g, C: ${food.carbs}g, G: ${food.fat}g, Kcal: ${food.calories} cal)`;

        const btn = document.createElement('button');
        btn.textContent = '+';
        btn.className = 'add-food-diet';
        btn.addEventListener('click', () => {
            if (!refeicaoSelecionada) {
        alert('Selecione uma refeição antes de adicionar!');
        return;
    }
            console.log(refeicaoSelecionada)
            const currentDiet = Cardapio.loadDiet()
            const updatedDiet = Cardapio.addFoodToMeal(currentDiet,refeicaoSelecionada,food.name)
            Cardapio.saveDiet(updatedDiet)
            Toastify({
                text: `${food.name} adicionado a dieta!`,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "white",
                style: { color: "green", fontWeight: "bold" }
            }).showToast();
        });

        li.appendChild(btn);
        return li;
    };

    proteinFoods.forEach(food => proteinListDiet.appendChild(createAddItem(food)));
    carbsFoods.forEach(food => carbListDiet.appendChild(createAddItem(food)));
    fatFoods.forEach(food => fatListDiet.appendChild(createAddItem(food)));
};

renderFoodsAdd();
    

//============================
// Seção 8: Lógica das Visualizações das Dietas
//============================

// Função para renderizar as dietas do usuário na seção "Ver Dietas"
function renderDietasUsuario() {
    // Carrega a dieta completa (com as refeições e seus respectivos alimentos)
    const diet = Cardapio.loadDiet(); 
    const container = document.getElementById('view-diets');
    container.innerHTML = `<h3>Visualizar Dietas</h3>`;

    // Percorre cada refeição para criar os botões e as listas
    Object.entries(diet).forEach(([refeicao, alimentos]) => {
        const botaoRefeicao = document.createElement('button');
        botaoRefeicao.className = 'refeicao-botao';
        botaoRefeicao.textContent = refeicao.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        const painelAlimentos = document.createElement('div');
        painelAlimentos.className = 'lista-alimentos';
        
        const ul = document.createElement('ul');
        if (alimentos.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Nenhum alimento cadastrado.';
            ul.appendChild(li);
        } else {
            alimentos.forEach(food => {
                const li = document.createElement('li');

                // Para melhor alinhamento, colocamos o texto em um span
                const textoAlimento = document.createElement('span');
                textoAlimento.textContent = `${food.name} (P: ${food.protein}g, C: ${food.carbs}g, G: ${food.fat}g, Kcal: ${food.calories} cal)`;
                li.appendChild(textoAlimento);

                // botao de delete
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'X';
                deleteBtn.className = 'delete-diet'; // Mantendo sua classe 

                // Adicionar evento de clique diretamente no botão
                deleteBtn.addEventListener('click', () => {
                    // LÓGICA CORRIGIDA: Chama uma função para remover o alimento da REFEIÇÃO específica
                   const sucesso = Cardapio.removeDiet(refeicao,food.name)
                    Cardapio.saveDiet(sucesso)
                    if (sucesso) {
                        // Sua notificação de sucesso
                        Toastify({
                            text: `${food.name} removido de ${refeicao.replace(/-/g, ' ')}!`,
                            duration: 3000,
                            gravity: "top",
                            position: "right",
                            backgroundColor: "white",
                            style: {
                                color: "red",
                                fontWeight: "bold",
                            }
                        }).showToast();

                        // Renderiza a lista de DIETAS novamente para atualizar a tela
                        renderDietasUsuario(); 
                    } else {
                        // Caso o alimento não seja encontrado
                        alert(`O alimento "${food.name}" não foi encontrado na refeição.`);
                    }
                });

                // Coloca o botão de deletar dentro do <li>
                li.appendChild(deleteBtn);
                
                ul.appendChild(li);
            });
        }
        
        painelAlimentos.appendChild(ul);
        container.appendChild(botaoRefeicao);
        container.appendChild(painelAlimentos);
    });

    // --- MUDANÇA 3: Adicionar a lógica de clique APÓS criar todos os botões ---
    const botoes = document.querySelectorAll(".refeicao-botao");
    botoes.forEach(botao => {
        botao.addEventListener("click", function() {
            // Adiciona/remove a classe 'active' para estilização (ex: mudar o ícone +/-)
            this.classList.toggle("active");

            // Pega o painel de alimentos que vem logo depois do botão
            const painel = this.nextElementSibling;

            // Se o painel já estiver aberto, fecha (remove a altura)
            if (painel.style.maxHeight) {
                painel.style.maxHeight = null;
            } else {
                // Se estiver fechado, abre (define a altura para o seu conteúdo total)
                painel.style.maxHeight = painel.scrollHeight + "px";
            }
        });
    });
}


// Seu código que chama a função continua o mesmo
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = Array.from(document.querySelectorAll('.nav-button'));
    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetId = event.currentTarget.dataset.page;
            if (targetId === 'view-diets') {
                renderDietasUsuario();
            }
        });
    });
});

//============================
// Seção 8: Graficos
//============================

const somacaltotal = () =>{
    const dietgraf = Cardapio.loadDiet()
     let totalCalcafe = dietgraf['cafe-da-manha'].reduce((soma, itemAtual) => {
      return soma + itemAtual.calories;
    }, 0); 

     let totalCallanchemanha = dietgraf['lanche-da-manha'].reduce((soma, itemAtual) => {
      return soma + itemAtual.calories;
    }, 0); 

     let totalCalalmoco = dietgraf['almoco'].reduce((soma, itemAtual) => {
      return soma + itemAtual.calories;
    }, 0); 

     let totalCallanchetarde = dietgraf['lanche-da-tarde'].reduce((soma, itemAtual) => {
      return soma + itemAtual.calories;
    }, 0); 

     let totalCaljanta = dietgraf['jantar'].reduce((soma, itemAtual) => {
      return soma + itemAtual.calories;
    }, 0); 

    let totalCalceia = dietgraf['ceia'].reduce((soma, itemAtual) => {
      return soma + itemAtual.calories;
    }, 0); 
    return [totalCalcafe,totalCallanchemanha, totalCalalmoco, totalCallanchetarde, totalCaljanta,totalCalceia]
}

const numerodealimentos = (nutriente)=>{
    const loadedFoods = Cardapio.loadFoods();
    const allFoods = loadedFoods.length === 0 ? Cardapio.resetFoods() : loadedFoods;
const [proteinFoods, carbFoods, fatFoods] = Cardapio.listFood(allFoods)
if(nutriente === 'proteinas'){
    return proteinFoods.length
}else if(nutriente === 'carboidratos'){
    return carbFoods.length
} else if(nutriente === 'gorduras'){return fatFoods.length}
}


//configuração para o gráfico donut
let options = {
plotOptions: {
  pie: {
    donut: {
      labels: {
        show: true, // Habilita os rótulos dentro do donut
        total: {
          show: true,           // Habilita a exibição do total
          showAlways: true,     // Mostra o total mesmo quando uma fatia está selecionada
          label: 'Total',       // O texto que aparece acima do número
          fontSize: '22px',     // Tamanho da fonte do número
          fontWeight: 600,      // Peso da fonte
          color: '#373d3f',     // Cor do texto
          formatter: function (w) {
            // Esta função calcula a soma de todas as séries
            return w.globals.seriesTotals.reduce((a, b) => {
              return a + b
            }, 0)
          }
        }
      }
    }
  }
},
    // Cada número representa uma fatia do donut.
   series: somacaltotal(),//retorna um array com a soma de cada refeição

   // Configurações gerais do gráfico
  chart: {
    type: 'donut', // define o tipo do gráfico como 'donut'
    width: '100%',  // Define a largura (pode ser em % ou pixels)
    height: 400     // Define a altura em pixels
  },

  colors: ['#E63946','#FF9800','#4CAF50','#ff4800ff','#2196F3','#1E2A38' ],
  // Os 'labels' correspondem a cada valor na 'series', na mesma ordem.
  labels: ['Café da Manhã', 'Lanche da Manhã', 'Almoço','Lanche da Tarde','Jantar','Ceia'],

  // Título do gráfico
  title: {
    text: 'Gasto calorico por refeição',
    align: 'center'
  },

  // Configuração para design responsivo
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
};

// configuração do grafico de barras

let options2 = {
  chart: {
    type: 'bar',
    height: 350 
  },

   title: {
    text: 'Quantidade de Alimentos por Macronutriente',
    align: 'center',
    style: {
      fontSize:  '16px',
      fontWeight:  'bold',
      color:  '#444'
    }
  },
  
  plotOptions: {
    bar: {
      distributed: true, // Habilita cores individuais para cada barra
      borderRadius: 4,   // Deixa as bordas das barras arredondadas
      horizontal: false, //Garante que as barras sejam verticais
    }
  },

  series: [{
    name: "Quantidade", // É uma boa prática nomear a série
    data: [{
      x: 'Proteínas',
      y: numerodealimentos('proteinas')
    }, {
      x: 'Carboidratos',
      y: numerodealimentos('carboidratos')
    }, {
      x: 'Gorduras',
      y: numerodealimentos('gorduras')
    }]
  }],

  colors: ['#008FFB', '#00E396', '#FEB019'],

  // Legenda
  legend: {
    show: false // Como cada barra já tem um label no eixo X, a legenda da série é redundante
  },
  
  xaxis: {
      type: 'category' // Garante que o eixo X trate os labels como categorias
  }
};

// Cria a instância do gráfico, ligando as opções ao elemento HTML
let chart = new ApexCharts(document.querySelector("#grafico-donut"), options);
let chart2 = new ApexCharts(document.querySelector("#grafico-column"), options2);
// Renderiza o gráfico na tela
chart.render();
chart2.render();