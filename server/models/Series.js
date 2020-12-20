const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seriesSchema = new Schema({
    title: {type: String, required: true},
    plot: String,
    year: String,
    thumbnail: String,
    rate: String,
    userName: String
});

const Series = mongoose.model('Series', seriesSchema, 'Serieses');

module.exports = Series;