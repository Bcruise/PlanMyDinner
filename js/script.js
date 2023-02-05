const apiKey = "9973533";
const ingredientsInput = $('#mealUserInput');
const mealResultsCont = $('#mealResultsContainer');
const ingredientsCont = $('#ingredientsContainer');
const cocktailRow = $('#cocktail-row');

//array to hold user input
var ingredients = [];
//array to hold all the ingredients name
var ingredientsName = [];

//function to get meals
function getMeals() {
    let baseURL = `https://www.themealdb.com/api/json/v2/${apiKey}/filter.php?i=${ingredients}`;
    getData(baseURL, 'Meals');

}

//function to get recipe details
function getRecipe(id) {
    let baseURL = `https://www.themealdb.com/api/json/v2/${apiKey}/lookup.php?i=${id}`;
    getData(baseURL, 'Recipe');
}


//function to get cocktails details
function getCocktail(id) {
    let baseURL = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
    getData(baseURL, "Cocktail");
}

//JS to provide a scroll bar to just the cocktail section
var pillsProfileTab = $('#pills-profile-tab');
pillsProfileTab.on('click', function () {
    if (pillsProfileTab[0].ariaSelected != true) {
        //$("body").css("overflow", "scroll");
        console.log(1);
    } else {
        //$("body").css("overflow", "hidden");
        console.log(2);
        console.log(pillsProfileTab[0].ariaSelected);
    }
})

//function to call ajax request
function getData(queryURL, type) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if(type == "Meals"){
            
            showMeals(response);
        }
        if(type == "Cocktail"){
        
        showCocktail(response);
         
        }
        if(type == "Recipe"){

            popModal(response);
        }

        //testing
        // console.log(type);
         console.log(response);
    });

}

//function to store and add to page from user input
function addIngredient(item) {
    //ensure not already in array
    if (!ingredients.includes(item)) {
        //add to array
        ingredients.push(item);
    }


}
//function to open model and populate
function popModal(data) {

    //get elements
    let title = $('#mealTitle');
    let ingredients = $('#mealIngredients');
    let instructions = $('#mealInstructions');
    let image = $('#mealImage');
    let youTube = $('#youTube');

    //arrays to hold ingredient information
    let ingredientsArray = [];
    let measureArray = [];

    //iterate through array to find ingredients and measures
    for (const [key, value] of Object.entries(data.meals[0])) {

        if(key.startsWith('strIngredient') && (value != null && value != '')){
            ingredientsArray.push(value);
        }
        if(key.startsWith('strMeasure') && (value != '' && value != 'undefined') ){
            measureArray.push(`<span class="measure">${value}</span>`);
            
        }
    }

    let ingredientList = '';
    //combine ingredients and measures into a string
    for( i=0; i < ingredientsArray.length; i++){
        let item = measureArray[i] + ': ' + ingredientsArray[i]+ '<br/>';
        ingredientList += item;
    }

    //set elements in modal
    title.html(data.meals[0].strMeal);
    instructions.html(data.meals[0].strInstructions.replace(/\./g,'.<br/>'));
    ingredients.html(ingredientList);
    image.attr('src',data.meals[0].strMealThumb);
    youTube.attr('href', data.meals[0].strYoutube);


    
}

//function to add ingredient to page

function addIngredientToPage(item) {

    //create html
    let html =
        `<div class="col">
            <div class="mb-3">
                <button data-button="ingredient" id="${item.replace(/\s+/g, '')}" data-id="${item}" class="btn btn-light w-100">${item}</button>
            </div>
        </div>`;
    //append to container
    ingredientsCont.prepend(html);

}
function removeIngredient(item){
   
    const index = ingredients.indexOf(item);
    if (index > -1) { // only splice array when item is found
    ingredients.splice(index, 1); // 2nd parameter means remove one item only
    }
    $('#'+item.replace(/\s+/g, '')).remove();

}

//function to add cocktail to page

function showCocktail (data) {
    
    cocktailRow.html('');
    
    let cocktailImage = data.drinks[0].strDrinkThumb;
    let cocktailTitle = data.drinks[0].strDrink;
    let cocktailCategory = `<div class="cocktail-category">
                                <p>${data.drinks[0].strCategory}</p>
                            </div>`
    let instructions = `<div>
                            <p>${data.drinks[0].strInstructions}</p>
                        </div>`
    let ingredientsHTML = '';

    for (let a = 1; a < 16; a++) {
        let ingredient = data.drinks[0][`strIngredient${a}`];
        let volume = data.drinks[0][`strMeasure${a}`];
        if (ingredient == null || ingredient == undefined || volume == null || volume == undefined) {
            a = 16;
        } else {

            ingredientsHTML += `<span class="each-ingredient">${ingredient} - ${volume}</span>`;

        }
    }

    let html = `<div class="col-lg-8 col-md-12">
                    <img class="cocktail-image" src="${cocktailImage}" alt="cocktail-image">
                </div>
                <div class="col-lg-4 col-md-12">
                    
                    <ul class="cocktail-details" id="cocktail-details">

                        <div class="cocktail-header-container">
                            <h3 class="cocktail-header">${cocktailTitle}</h3>
                        </div>
                        <span class="category-span">Category</span>
                        ${cocktailCategory}
                        <span class="ingredients-span">Ingredients</span>
                        ${ingredientsHTML}
                        <p class="space"></p>
                        <span class="instructions-span">Instructions</span>
                        ${instructions}
                     </ul>
                </div>
                `;

    cocktailRow.append(html);
}

// pushing of cocktail information onto page
getCocktail();

//function to show meal results
function showMeals(data) {

    mealResultsCont.html('');

    //If data response is not equal to null then show the card recipes.
    //Unable to use length as cannot read property of ‘length’ if null
    if (data.meals != null){

        //get meal data
        for(i= 0; i< data.meals.length; i++){
            let id = data.meals[i].idMeal;
        let title = data.meals[i].strMeal;
        let image = data.meals[i].strMealThumb;
        //create html
        let html =
        
             `<div id="card" class="card col-sm-8 col-md-5 col-lg-3 m-3 p-2 card-one" data-button="meal" data-id="${id}" data-bs-toggle="modal" data-bs-target="#ViewRecipeModal">
        <img src="${image}" class="card-img-top" alt="${title}" data-button="meal" data-id="${id}" data-bs-toggle="modal" data-bs-target="#ViewRecipeModal">
        <div class="card-body" data-button="meal" data-id="${id}" data-bs-toggle="modal" data-bs-target="#ViewRecipeModal">
            <span data-button="meal" data-id="${id}" data-bs-toggle="modal" data-bs-target="#ViewRecipeModal">${title}</span>
         </div>
         </div>`;
        //append to container
        mealResultsCont.append(html);
        
        }
    }
    //If there is no result then show this card with this img src
    else{
        let html =
        `<div class="card col-5 m-3 card-one">
        <img src="/images/no-results-found.png" class="card-img-top" alt="...">
        </div>`;
        //append to container
        mealResultsCont.append(html);
        
    }
    
}
//function to change page style
function changeStyle(page){
    var tabContent = $('.tab-content');
    if(page == 'cocktail'){
        tabContent.css("background-image", "linear-gradient(to bottom, rgba(0,0,0,0.9), white 95%)");
        
    }
    if(page == 'meals'){
        tabContent.css("background-image", "linear-gradient(to bottom, white, white 95%)");
    }
}

//function to handle clicks
function clickHandler(button) {
    
    //if add ingridients btn clicked
    if (button.data('button') == 'add' && ingredientsInput.val() != '') {
        //If the ingredient chosen is not in the list of ingredients from API
        if (!ingredientsName.includes(ingredientsInput.val())){
            ingredientsInput.val('Sorry ingredient not available');
        }
        else{
            let item = ingredientsInput.val()
            addIngredient(item);
            addIngredientToPage(item);
            ingredientsInput.val('');
            getMeals();
        }
    }
    //if meal item clicked
    if (button.data('button') == 'meal') {
        getRecipe(button.data('id'));
    }
    //cocktail button pressesd
    if (button.data('button') == 'cocktail') {
        changeStyle('cocktail');
        getCocktail();
    }
    if (button.data('button') == 'meals') {
        changeStyle('meals');
    }
    if (button.data('button') == 'ingredient') {
        let id = button.data('id');
        removeIngredient(id);
        getMeals();
    }

}

//testing
// getMeals();
// getRecipe('52772');


//click listener for all buttons
$('body').on('click', function (event) {
    //allow default youtube link action
    if(event.target.id != "youTube"){
        event.preventDefault();
    }
    clickHandler($(event.target));
});



//URL for getting all the ingredients
var queryURL = "https://themealdb.com/api/json/v1/1/list.php?i=list";

//Ajax call to get all ingredients
$.ajax({
    url: queryURL,
    method: "GET"
})
.then(function(response){
    //For loop, get ingredients name and store in ingredientsName array
    for (let i = 1; i < response.meals.length; i++)
    {
        ingredientsName.push(response.meals[i].strIngredient)
    }
    
});

//JQuery UI Autocomplete with the lists
$(function(){
    $("#mealUserInput").autocomplete({
      source: ingredientsName 
    });
  } );

  changeStyle('meals');