const axios = require("axios");

const fetchRecipes = async () => {
    const response = await axios.post("http://s-recipes-api/recipes-search", {
        "query" : "Bread"
    });
    
    console.log(response.data)
}

setInterval(() => {
    fetchRecipes();
}, 2000);