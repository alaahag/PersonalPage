const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
    title: String,
    description: String,
    photo: {type: String, required: true},
    userName: String
});

const Photo = mongoose.model('Photo', photoSchema, 'Photos');

module.exports = Photo;