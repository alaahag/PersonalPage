const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    thumbnail: String,
    userName: String
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema, 'Restaurants');

module.exports = Restaurant;