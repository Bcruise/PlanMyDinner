const apiKey = "9973533";
const ingredientsInput = $(''); //{NEED INPUT ID}
const modelID = $(''); //{NEED MODAL ID}

//array to hold user input
var ingredients = [];

//function to get meals
function getMeals(){
    let baseURL = `https://www.themealdb.com/api/json/v2/${apiKey}/filter.php?i=${ingredients}`;
    getData(baseURL, 'Meals');
}

//function to get recipe details
function getRecipe(id){
    let baseURL = `https://www.themealdb.com/api/json/v2/${apiKey}/lookup.php?i=${id}`;
    getData(baseURL,'Recipe');
}

//function to call ajax request
function getData(queryURL, type) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if(type == "Meals"){

        }
        if(type == "Recipe"){

        }
        //testing
        console.log(type);
        console.log(response);
    });

}

//function to store and add to page from user input
function addIngredient(item){
    //ensure not already in array
    if(!ingredients.includes(item)){
    //add to array
    ingredients.push(item);
    }

}
//function to open model and populate
function popModal(id){
    let meal = getRecipe(id);
}

//function to add ingridient to page
function addIngredientToPage(item){
    //{NEED HTML FORMAT OF BUTTON TO ADD}
}

//function to handle clicks
function clickHandler(button){
    //if add ingridients btn clicked
    if(button.data('button') == 'add'){
        let item = ingredientsInput.val()
        addIngredient(item);
        addIngredientToPage(item);
    }
    //if search btn clicked
    if(button.data('button') == 'search'){
        getMeals();
    }
    //if meal item clicked
    if(button.data('button') == 'meal'){
        popModal(button.data('id'));
    }
    
}

//testing
getMeals();
getRecipe('52772');


//click listener for all buttons
$('body').on('click', function (event) {
    clickHandler(event.target);
});