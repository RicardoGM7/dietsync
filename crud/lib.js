////////////// ADAPTAÇÃO DO CRUD DA BIBLIOTECA /////////////////

// Chave usada no localStorage para salvar os livros
const STORAGE_KEY = "dietas::foods"

// ========================
// Persistência (salvar, carregar, limpar os dados)
// ========================

// Carrega a lista de Alimentos do localStorage
// Se não existir nada salvo, retorna um array vazio
const loadFoods = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

// Salva a lista de Alimentos no localStorage (convertendo para texto JSON)
const saveFoods = foods =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(foods))

// Remove todos os Alimentos do localStorage
const clearFoods = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log("Alimentos Removidos.")
}

// Restaura uma lista inicial de Alimentos (pré-cadastrados)
// Útil para resetar o sistema com dados de exemplo
const resetFoods = () => {
const foods =  [{ id: 1, name: "Peito de Frango cozido", protein: 31, carbs: 0, fat: 3.6, calories: 165, portion: 0 },
  { id: 2, name: "Filé de Salmão cozido", protein: 20, carbs: 0, fat: 13, calories: 208, portion: 0 },
  { id: 3, name: "Bife de Picanha", protein: 25, carbs: 0, fat: 20, calories: 286, portion: 0 },
  { id: 4, name: "Queijo Cottage", protein: 11, carbs: 3.4, fat: 4.3, calories: 98, portion: 0 },
  { id: 5, name: "Clara de Ovo", protein: 11, carbs: 0.7, fat: 0.2, calories: 52, portion: 0 },
  { id: 6, name: "Carne Moída de patinho", protein: 26, carbs: 0, fat: 15, calories: 240, portion: 0 },
  { id: 7, name: "Atum em lata", protein: 25, carbs: 0, fat: 1, calories: 116, portion: 0 },
  { id: 8, name: "Iogurte Grego natural", protein: 10, carbs: 3.6, fat: 0.4, calories: 59, portion: 0 },
  { id: 9, name: "Peito de peru", protein: 29, carbs: 0.3, fat: 1.4, calories: 140, portion: 0 },
  { id: 10, name: "Tofu", protein: 8, carbs: 3, fat: 4.8, calories: 76, portion: 0 },
  { id: 11, name: "Cordeiro cozido", protein: 25, carbs: 0, fat: 16, calories: 250, portion: 0 },
  { id: 12, name: "Feijão Preto cozido", protein: 8.9, carbs: 23, fat: 0.9, calories: 132, portion: 0 },
  { id: 13, name: "Arroz integral cozido", protein: 2.6, carbs: 23, fat: 1, calories: 111, portion: 0 },
  { id: 14, name: "Batata Doce cozida", protein: 1.6, carbs: 20, fat: 0.1, calories: 86, portion: 0 },
  { id: 15, name: "Pão integral", protein: 7.6, carbs: 41, fat: 3.2, calories: 247, portion: 0 },
  { id: 16, name: "Aveia em flocos", protein: 13, carbs: 68, fat: 6.9, calories: 379, portion: 0 },
  { id: 17, name: "Quinoa cozida", protein: 4.4, carbs: 21, fat: 1.9, calories: 120, portion: 0 },
  { id: 18, name: "Milho cozido", protein: 3.3, carbs: 19, fat: 1.2, calories: 86, portion: 0 },
  { id: 19, name: "Banana", protein: 1.1, carbs: 23, fat: 0.3, calories: 89, portion: 0 },
  { id: 20, name: "Batata inglesa cozida", protein: 2, carbs: 17, fat: 0.1, calories: 77, portion: 0 },
  { id: 21, name: "Inhame cozido", protein: 1.5, carbs: 24, fat: 0.2, calories: 118, portion: 0 },
  { id: 22, name: "Pão francês", protein: 8, carbs: 50, fat: 2.8, calories: 277, portion: 0 },
  { id: 23, name: "Laranja", protein: 0.9, carbs: 12, fat: 0.1, calories: 47, portion: 0 },
  { id: 24, name: "Abacate", protein: 2, carbs: 8.5, fat: 15, calories: 160, portion: 0 },
  { id: 25, name: "Amendoim torrado", protein: 26, carbs: 16, fat: 49, calories: 567, portion: 0 },
  { id: 26, name: "Azeite de Oliva Extra Virgem", protein: 0, carbs: 0, fat: 100, calories: 884, portion: 0 },
  { id: 27, name: "Nozes", protein: 15, carbs: 14, fat: 65, calories: 654, portion: 0 },
  { id: 28, name: "Manteiga", protein: 0.9, carbs: 0.1, fat: 81, calories: 717, portion: 0 },
  { id: 29, name: "Castanha-do-Pará", protein: 14, carbs: 12, fat: 66, calories: 656, portion: 0 },
  { id: 30, name: "Óleo de Coco", protein: 0, carbs: 0, fat: 100, calories: 892, portion: 0 },
  { id: 31, name: "Salmão defumado", protein: 18, carbs: 0, fat: 12, calories: 190, portion: 0 },
  { id: 32, name: "Creme de Leite", protein: 2.5, carbs: 3.7, fat: 20, calories: 200, portion: 0 },
  { id: 33, name: "Chocolate Amargo (85%)", protein: 10, carbs: 19, fat: 45, calories: 599, portion: 0 },
  { id: 34, name: "Abacate", protein: 2, carbs: 8.5, fat: 15, calories: 160, portion: 0 },
  { id: 35, name: "Amêndoas", protein: 21, carbs: 22, fat: 50, calories: 579, portion: 0 },
  { id: 36, name: "Castanha de Caju", protein: 18, carbs: 30, fat: 44, calories: 553, portion: 0 },
  { id: 37, name: "Ovo Cozido", protein: 13, carbs: 1.1, fat: 11, calories: 155, portion: 0 },
  { id: 38, name: "Leite Integral", protein: 3.3, carbs: 5, fat: 3.6, calories: 61, portion: 0 },
  { id: 39, name: "Cenoura", protein: 0.9, carbs: 10, fat: 0.2, calories: 41, portion: 0 },
  { id: 40, name: "Maçã", protein: 0.3, carbs: 14, fat: 0.2, calories: 52, portion: 0 },
  { id: 41, name: "Brócolis", protein: 2.8, carbs: 7, fat: 0.4, calories: 35, portion: 0 }
];

// Listando todos os alimentos
foods.forEach(foods => {
  console.log(foods.nome);
});


  saveFoods(foods) // salva os alimentos no localStorage
  console.log("Lista de Alimentos salvos.")
  return foods              // retorna os alimentos
}

// ========================
// CRUD funcional (Create, Read, Update, Delete)
// ========================

// Adiciona um novo alimento (retorna um novo array)
const addFood = (foods, newFood) => [...foods, newFood]

// Atualiza um alimento existente (caso encontre o Nome) (NÃO RETIRA ISSO)
const updateFood = (foods, name, updates) =>
  foods.map(food => (food.name === name? { ...food, ...updates } : food))

// Remove um Alimento pelo Nome
const deleteFood = (foods, nome) =>
  foods.filter(food => food.name.toLowerCase() !== nome.toLowerCase())



// ======================== 
// Listagem e formatação
// ========================



// Lista os Alimentos em formato de grupos por quantidade de Macronutrientes

const filterProtein = ([x,...xs]) =>{
  if (x === undefined) {return []}
  else if(x.protein >= x.carbs && x.protein >= x.fat) {
    return [x,...filterProtein(xs)]
  }
  else {return filterProtein(xs)}
}

const filterCarbs = ([x,...xs]) =>{
  if (x === undefined) {return[]}
  else if(x.carbs > x.protein && x.carbs >= x.fat){
    return [x,...filterCarbs(xs)]
  }
  else {return filterCarbs(xs)}
}

const filterFat = ([x,...xs]) => {
  if (x === undefined) {return[]}
  else if(x.fat > x.protein && x.fat > x.carbs){
    return [x,...filterFat(xs)]
  }
  else {return filterFat(xs)}
}

const listFood = (foods) =>{
  return [filterProtein(foods),filterCarbs(foods),filterFat(foods)]
}


// Lista apenas as informações de um alimento específico
const listSpecificFood = (foods, foodName) =>
  foods.filter(food => food.name.toLowerCase() === foodName.toLowerCase())

//=== Toda essa parte serve para fazer a organização da dieta funcionar ===
// É basicamente uma lib dentro da lib

// Estrutura das 6 refeições do dia, que vão estar vazias para os alimentos da lista poderem ser passados
// A parte a baixo será usada para quando não houver nenhuma dieta cadastrada
const initialDiet = {
  'cafe-da-manha': [],
  'lanche-da-manha': [],
  'almoco': [],
  'lanche-da-tarde': [],
  'jantar': [],
  'ceia': []
}

// Aqui será o equivalente ao saveFoods, mas para a dieta
const saveDiet = (diet) =>{
  localStorage.setItem('userDiet',JSON.stringify(diet))
}

// O equivalente ao loadFoods, mas para a dieta
const loadDiet = () =>{
  const diet = localStorage.getItem('userDiet');
  // Basicamente, ele retorna a dieta salva, caso não tenha, a lista vazia que definimos acima
  return diet ? JSON.parse(diet) : initialDiet
}

const removeDiet = (refeicao, foodName) => {
    // 1. Carrega a dieta salva
    const diet = Cardapio.loadDiet();

    const tamanhoOriginal = diet[refeicao].length;

    // 2. Filtra o array, criando uma nova lista de alimentos para a refeição
    diet[refeicao] = diet[refeicao].filter(food => food.name !== foodName);

    // 3. Verifica se a remoção funcionou
    if (diet[refeicao].length < tamanhoOriginal) {
        return diet;
    }
}


// Novamente, esse é o equivalente ao addFoods, mas para a dieta
const  addFoodToMeal = (currentDiet, mealName, foodToAdd) =>{
  // Aqui eu estou carregando a lista de alimentos e procurando o primeiro alimento com o nome que vai ser passado
  const allFoods = Cardapio.loadFoods()
  const foundFood = allFoods.filter((food) => food.name.toLowerCase() === foodToAdd.toLowerCase())[0]
    
  if(foundFood){
    // Em vez de trabalhar com o valor original das refeições, criar uma cópia para não alterar o estado original
    // Assim pode evitar possíveis bugs, ou problemas quando a mesma função for puxada novamente
    const newDiet = {...currentDiet}
      
    // Aqui vai servir para adicionar um alimento para a lista de refeição que ele foi escolhido
    newDiet[mealName].push(foundFood)

    return newDiet
  }
  // Caso não tenha o alimento, ou ele não seja encontrado, retorna a lista original
  return currentDiet
}

// Calculo do IMC (Ainda Não implementado)
const imc = (height) => (weight) => (weight)/(height**2)

// Achar uma alimento com valores similares(Ainda incompleta)

const similarSearch = (referenceFood) => (foodList) =>{
  const distanceFood = foodList.map((food) =>{
    const distance = Math.sqrt((food.protein - referenceFood.protein)**2 +(food.carbs - referenceFood.carbs)**2 +(food.fat - referenceFood.fat)**2)
    return { nome: food.name, distancia: distance}
  })
  return distanceFood
}

// Dúvida, tenho que ordenar os valores com menores distâncias.

// Permite formatar a lista de alimentos de forma flexível
// Recebe uma função "formatFn" que define como cada alimento deve aparecer
const formatFoods = (foods, formatFn) =>
  foods.map((food, index) => formatFn(food, index)).join('\n')

// Formatação curta: apenas o nome com numeração
const shortFormat = (food, i) => `${i + 1}. ${food.name}`

// Formatação completa: id, nome, proteínas, carboidratos, calorias e porções
const fullFormat = food =>
  `${food.id} - "${food.name}" (${food.protein},  ${food.carbs}, ${food.calories}, ${food.portion})`



// ========================
// Transformações adicionais
// ========================



// Adiciona uma categoria com base no tipo de alimento (função fornecida pelo usuário)
const addCategoryByName = (foods, classifyNameFn) =>
  foods.map(food => ({ ...food, category: classifyNameFn(food.name) }))

// Aplica uma transformação nos nomes (ex: deixar tudo maiúsculo)
const updateTitles = (foods, transformFn) =>
  foods.map(food => ({ ...food, name: transformFn(food.name) }))

// Permite renomear os campos de cada Alimento (ex: trocar "title" por "nome")
const renameFields = (foods, renamerFn) =>
  foods.map(food => renamerFn(food))



// ========================
// Exporta todas as funções como um objeto Cardapio
// Isso facilita o uso em outros arquivos (ex: ui.js)
// ========================


export const Cardapio = {
  // Persistência
  loadFoods, saveFoods, resetFoods, clearFoods, 

  // CRUD
  addFood, updateFood, deleteFood, saveDiet,loadDiet,addFoodToMeal,similarSearch, removeDiet,

  // Exibição
  listFood, listSpecificFood, formatFoods, shortFormat, fullFormat,imc,

  // Transformações
  addCategoryByName, updateTitles, renameFields, filterProtein, filterCarbs, filterFat,
  
}
