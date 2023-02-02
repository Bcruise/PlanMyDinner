const apiKey = "9973533";
const ingredientsInput = $('#mealUserInput');
const modelID = $(''); //{NEED MODAL ID}
const mealResultsCont = $('#mealResultsContainer');
const ingredientsCont = $('#ingredientsContainer');

//array to hold user input
var ingredients = [];

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
function popModal(id) {
    let meal = getRecipe(id);
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
    //get meal data
    for(i= 0; i< data.meals.length; i++){
        let id = data.meals[i].idMeal;
    let title = data.meals[i].strMeal;
    let image = data.meals[i].strMealThumb;
    //create html
    let html =
        `<div class="card col-6 mt-2 card-one">
        <img src="${image}" class="card-img-top" alt="...">
        <div class="card-body">
            <span>${title}</span>
        </div>
    </div>`;
    //append to container
    mealResultsCont.append(html);
    }
    

}

//function to handle clicks
function clickHandler(button) {
    //if add ingridients btn clicked
    if (button.data('button') == 'add' && ingredientsInput.val() != '') {

        let item = ingredientsInput.val()
        addIngredient(item);
        addIngredientToPage(item);
        ingredientsInput.val('');
        getMeals();
        

    }
    //if search btn clicked
    if (button.data('button') == 'search') {
        getMeals();
    }
    //if meal item clicked
    if (button.data('button') == 'meal') {
        popModal(button.data('id'));
    }

}

//testing
// getMeals();
// getRecipe('52772');


//click listener for all buttons
$('body').on('click', function (event) {
    event.preventDefault();
    clickHandler($(event.target));
});




