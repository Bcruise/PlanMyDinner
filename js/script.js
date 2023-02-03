const apiKey = "9973533";
const ingredientsInput = $('#mealUserInput');
const mealResultsCont = $('#mealResultsContainer');
const ingredientsCont = $('#ingredientsContainer');

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

//function to call ajax request
function getData(queryURL, type) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if(type == "Meals"){
            
            showMeals(response);
        }
        if(type == "Recipe"){

            popModal(response);
        }
        //testing
        // console.log(type);
        // console.log(response);
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

    console.log(data);
    let title = $('#mealTitle');
    let ingredients = $('#mealIngredients');
    let instructions = $('#mealInstructions');
    let image = $('#mealImage');
    let youTube = $('#youTube');

    let ingredientsArray = [];
    let measureArray = []

    for (const [key, value] of Object.entries(data.meals[0])) {

        if(key.startsWith('strIngredient') && (value != null && value != '')){
            ingredientsArray.push(value);
        }
        if(key.startsWith('strMeasure') && (value != '' && value != 'undefined') ){
            measureArray.push(`<span class="measure">${value}</span>`);
            
        }
    }

    let ingredientList = '';

    for( i=0; i < ingredientsArray.length; i++){
        let item = measureArray[i] + ': ' + ingredientsArray[i]+ '<br/>';
        ingredientList += item;
    }

    
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
                <button class="btn btn-light w-100">${item}</button>
            </div>
        </div>`;
    //append to container
    ingredientsCont.prepend(html);

}

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
        
             `<div class="card col-sm-8 col-md-5 col-lg-3 m-3 p-2 card-one" data-button="meal" data-id="${id}" data-bs-toggle="modal" data-bs-target="#ViewRecipeModal">
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

