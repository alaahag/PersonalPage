const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {type: String, required: true},
    note: String,
    userName: String
});

const Note = mongoose.model('Note', noteSchema, 'Notes');

module.exports = Note;