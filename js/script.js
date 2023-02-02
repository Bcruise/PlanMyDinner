const apiKey = "9973533";

function getMeals(){
    let baseURL = `https://www.themealdb.com/api/json/v2/${apiKey}/filter.php?i=chicken_breast,salt`;
    getData(baseURL, 'Meals');
}

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
        console.log(type);
        console.log(response);
    });

}

getMeals();
getRecipe('52772');