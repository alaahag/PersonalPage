const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const youtubeSchema = new Schema({
    title: String,
    link: {type: String, required: true},
    description: String,
    userName: String
});

const Youtube = mongoose.model('Youtube', youtubeSchema, 'Youtubes');

module.exports = Youtube;