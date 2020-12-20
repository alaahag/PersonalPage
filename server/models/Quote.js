const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quoteSchema = new Schema({
    title: {type: String, required: true},
    author: String,
    userName: String
});

const Quote = mongoose.model('Quote', quoteSchema, 'Quotes');

module.exports = Quote;