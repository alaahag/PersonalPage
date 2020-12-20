const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    thumbnail: String,
    userName: String
});

const Recipe = mongoose.model('Recipe', recipeSchema, 'Recipes');

module.exports = Recipe;