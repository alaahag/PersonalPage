const express = require('express');
const router = express.Router();
const axios = require('axios');
const session = require('express-session');
const Book = require('../models/Book.js');
const Link = require('../models/Link.js');
const Movie = require('../models/Movie.js');
const Series = require('../models/Series.js');
const Note = require('../models/Note.js');
const Photo = require('../models/Photo.js');
const Quote = require('../models/Quote.js');
const Recipe = require('../models/Recipe.js');
const Restaurant = require('../models/Restaurant.js');
const User = require('../models/User.js');
const Youtube = require('../models/Youtube.js');
const Books_API_KEY = "AIzaSyDSqefB9VlxkmI8tXqjzsdab5roCN4SKT0";
const OMDB_API_KEY = "15f932bf";
const Weather_API_KEY = "484da5e921c1d538aee222ffd65ca2da";

router.use(session({
	secret: 'hahaha',
	saveUninitialized: true,
	resave: true
}));
let sess;

/* SANITY CHECK */
router.get('/sanity', function(req, res) {
	//200 = OK
	res.sendStatus(200);
});
/* END OF SANITY CHECK */

/* GET WEATHER */
router.get('/weather/:lat/:lon', async function(req, res) {
	try {
		const weatherData = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${req.params.lat}&lon=${req.params.lon}&appid=${Weather_API_KEY}&units=metric`);
		res.json({ temperature: weatherData.data.main.temp });
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF WEATHER */

/* GET RANDOM QUOTE */
router.get('/quote', async function(req, res) {
	try {
		const quote = await axios.get('http://quotes.stormconsultancy.co.uk/random.json');
		res.json({ quote: quote.data.quote, author: quote.data.author });
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF RANDOM QUOTE */

/* REQUEST SESSION */
router.get('/session', function(req, res) {
	if (sess)
		res.send({
			userName: sess.userName,
			password: sess.password,
			isDarkMode: sess.isDarkMode
		});
	else
		res.send(null);
});

router.get('/sessionDelete', function(req, res) {
	req.session.destroy();
	req.session = null;
	sess = null;
	res.send(null);
});
/* END OF REQUEST OF SESSION */

/* USER SCHEME */
router.get('/user/:userName', async function(req, res) {
	try {
		const user = await User.find({ userName: req.params.userName });
		res.send(user);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/user/login', async function(req, res) {
	try {
		const user = await User.findOne({ userName: req.body.userName });
		if (req.body.password === user.password) {
			sess = req.session;
			sess.userName = user.userName;
			sess.password = user.password;
			sess.isDarkMode = user.isDarkMode;
			res.send(user);
		}
		else
			res.send(null);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/user/register', async function(req, res) {
	try {
		const user = new User({ ...req.body });
		await user.save();
		res.send(user);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/update/:userName', async function(req, res) {
	try {
		const user = await User.findOneAndUpdate({ userName: req.params.userName }, { isDarkMode: !sess.isDarkMode }, { new: true });
		sess.isDarkMode = !sess.isDarkMode;
		res.send(user);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

// });
/* END OF USER SCHEME */

/* BOOK SCHEME */
router.get('/books/:userName', async function(req, res) {
	try {
		const books = await Book.find({ userName: req.params.userName });
		res.send(books);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/book/:bookName', async function(req, res) {
	//example: `https://www.googleapis.com/books/v1/volumes?key=${Books_API_KEY}&q=the%20girl%20with`
	try {
		const bookData = await axios.get(`https://www.googleapis.com/books/v1/volumes?key=${Books_API_KEY}&q=title:${req.params.bookName}`);
		//const bookData = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=title:${req.params.bookName}`
		if (bookData.data.items) {
			const books = [];
			for (let b of bookData.data.items) {
				books.push({
					title: b.volumeInfo.title,
					author: b.volumeInfo.authors,
					thumbnail: b.volumeInfo.imageLinks.thumbnail,
					description: b.volumeInfo.description
				});
			}
			res.send(books);
		}
		else
			res.send(null);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/book', async function(req, res) {
	try {
		const book = new Book({ ...req.body });
		await book.save();
		res.send(book);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/books/data/:bookId', async function(req, res) {
	try {
		const book = await Book.findOne({ _id: req.params.bookId });
		res.send(book);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/book/:bookId', async function(req, res) {
	try {
		const obj = req.body;
		const book = await Book.findByIdAndUpdate(req.params.bookId, {$set: obj}, {new: true});
		res.send(book);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.delete('/books/:bookId', async function(req, res) {
	try {
		const book = await Book.findByIdAndRemove({ _id: req.params.bookId });
		res.send(book);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF BOOK SCHEME */

/* LINK SCHEME */
router.get('/links/:userName', async function(req, res) {
	try {
		const links = await Link.find({ userName: req.params.userName });
		res.send(links);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/link', async function(req, res) {
	try {
		const link = new Link({ ...req.body });
		await link.save();
		res.send(link);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/links/data/:linkId', async function(req, res) {
	try {
		const link = await Link.findOne({ _id: req.params.linkId });
		res.send(link);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/link/:linkId', async function(req, res) {
	try {
		const obj = req.body;
		const link = await Link.findByIdAndUpdate(req.params.linkId, {$set: obj}, {new: true});
		res.send(link);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.delete('/links/:linkID', async function(req, res) {
	try {
		const link = await Link.findByIdAndRemove({ _id: req.params.linkID });
		res.send(link);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF LINK SCHEME */

/* NOTE SCHEME */
router.get('/notes/:userName', async function(req, res) {
	try {
		const notes = await Note.find({ userName: req.params.userName });
		res.send(notes);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/note', async function(req, res) {
	try {
		const note = new Note({ ...req.body });
		await note.save();
		res.send(note);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/notes/data/:noteId', async function(req, res) {
	try {
		const note = await Note.findOne({ _id: req.params.noteId });
		res.send(note);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/note/:noteId', async function(req, res) {
	try {
		const obj = req.body;
		const note = await Note.findByIdAndUpdate(req.params.noteId, {$set: obj}, {new: true});
		res.send(note);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.delete('/notes/:noteID', async function(req, res) {
	try {
		const note = await Note.findByIdAndRemove({ _id: req.params.noteID });
		res.send(note);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF NOTE SCHEME */

/* PHOTO SCHEME */
router.get('/photos/:userName', async function(req, res) {
	try {
		const photos = await Photo.find({ userName: req.params.userName });
		res.send(photos);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/photo', async function(req, res) {
	try {
		const photo = new Photo({ ...req.body });
		await photo.save();
		res.send(photo);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/photos/data/:photoId', async function(req, res) {
	try {
		const photo = await Photo.findOne({ _id: req.params.photoId });
		res.send(photo);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/photo/:photoId', async function(req, res) {
	try {
		const obj = req.body;
		const photo = await Photo.findByIdAndUpdate(req.params.photoId, {$set: obj}, {new: true});
		res.send(photo);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.delete('/photos/:photoID', async function(req, res) {
	try {
		const photo = await Photo.findByIdAndRemove({ _id: req.params.photoID });
		res.send(photo);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF PHOTO SCHEME */

/* QUOTE SCHEME */
router.get('/quotes/:userName', async function(req, res) {
	try {
		const quotes = await Quote.find({ userName: req.params.userName });
		res.send(quotes);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/quote', async function(req, res) {
	try {
		const quote = new Quote({ ...req.body });
		await quote.save();
		res.send(quote);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/quotes/data/:quoteId', async function(req, res) {
	try {
		const quote = await Quote.findOne({ _id: req.params.quoteId });
		res.send(quote);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/quote/:quoteId', async function(req, res) {
	try {
		const obj = req.body;
		const quote = await Quote.findByIdAndUpdate(req.params.quoteId, {$set: obj}, {new: true});
		res.send(quote);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.delete('/quotes/:quoteID', async function(req, res) {
	try {
		const quote = await Quote.findByIdAndRemove({ _id: req.params.quoteID });
		res.send(quote);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF QUOTE SCHEME */

/* RECIPE SCHEME */
router.get('/recipes/:userName', async function(req, res) {
	try {
		const recipes = await Recipe.find({ userName: req.params.userName });
		res.send(recipes);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/recipe', async function(req, res) {
	try {
		const recipe = new Recipe({ ...req.body });
		await recipe.save();
		res.send(recipe);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/recipes/data/:recipeId', async function(req, res) {
	try {
		const recipe = await Recipe.findOne({ _id: req.params.recipeId });
		res.send(recipe);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/recipe/:recipeId', async function(req, res) {
	try {
		const obj = req.body;
		const recipe = await Recipe.findByIdAndUpdate(req.params.recipeId, {$set: obj}, {new: true});
		res.send(recipe);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.delete('/recipes/:recipeID', async function(req, res) {
	try {
		const recipe = await Recipe.findByIdAndRemove({ _id: req.params.recipeID });
		res.send(recipe);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF RECIPE SCHEME */

/* RESTAURANT SCHEME */
router.get('/restaurants/:userName', async function(req, res) {
	try {
		const restaurants = await Restaurant.find({ userName: req.params.userName });
		res.send(restaurants);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/restaurant', async function(req, res) {
	try {
		const restaurant = new Restaurant({ ...req.body });
		await restaurant.save();
		res.send(restaurant);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/restaurants/data/:restaurantId', async function(req, res) {
	try {
		const restaurant = await Restaurant.findOne({ _id: req.params.restaurantId });
		res.send(restaurant);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/restaurant/:restaurantId', async function(req, res) {
	try {
		const obj = req.body;
		const restaurant = await Restaurant.findByIdAndUpdate(req.params.restaurantId, {$set: obj}, {new: true});
		res.send(restaurant);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.delete('/restaurants/:restaurantId', async function(req, res) {
	try {
		const restaurant = await Restaurant.findByIdAndRemove({ _id: req.params.restaurantId });
		res.send(restaurant);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF RESTAURANT SCHEME */

/* YOUTUBE SCHEME */
router.get('/youtubes/:userName', async function(req, res) {
	try {
		const youtube = await Youtube.find({ userName: req.params.userName });
		res.send(youtube);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/youtube', async function(req, res) {
	try {
		const youtube = new Youtube({ ...req.body });
		await youtube.save();
		res.send(youtube);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/youtubes/data/:youtubeId', async function(req, res) {
	try {
		const youtube = await Youtube.findOne({ _id: req.params.youtubeId });
		res.send(youtube);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/youtube/:youtubeId', async function(req, res) {
	try {
		const obj = req.body;
		const youtube = await Youtube.findByIdAndUpdate(req.params.youtubeId, {$set: obj}, {new: true});
		res.send(youtube);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.delete('/youtubes/:youtubeId', async function(req, res) {
	try {
		const youtube = await Youtube.findByIdAndRemove({ _id: req.params.youtubeId });
		res.send(youtube);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF YOUTUBE SCHEME */

/* MOVIE SCHEME */
router.get('/movies/:userName', async function(req, res) {
	try {
		const movies = await Movie.find({ userName: req.params.userName });
		res.send(movies);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/movie/:movieName', async function(req, res) {
	//example: `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=mirage`
	try {
		const movieData = await axios.get(`http://www.omdbapi.com/?type=movie&apikey=${OMDB_API_KEY}&t=${req.params.movieName}`);
		const movie ={
			title: movieData.data.Title,
			plot: movieData.data.Plot,
			year: movieData.data.Year,
			thumbnail: movieData.data.Poster,
			rate: movieData.data.Ratings[0].Value
		};
		res.send(movie);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/movie', async function(req, res) {
	try {
		const movie = new Movie({ ...req.body });
		await movie.save();
		res.send(movie);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/movies/data/:movieId', async function(req, res) {
	try {
		const movie = await Movie.findOne({ _id: req.params.movieId });
		res.send(movie);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/movie/:movieId', async function(req, res) {
	try {
		const obj = req.body;
		const movie = await Movie.findByIdAndUpdate(req.params.movieId, {$set: obj}, {new: true});
		res.send(movie);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.delete('/movies/:movieId', async function(req, res) {
	try {
		const movie = await Movie.findByIdAndRemove({ _id: req.params.movieId });
		res.send(movie);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF MOVIES SCHEME */

/* SERIES SCHEME */
router.get('/serieses/:userName', async function(req, res) {
	try {
		const serieses = await Series.find({ userName: req.params.userName });
		res.send(serieses);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/series/:seriesName', async function(req, res) {
	//example: `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=mirage`
	try {
		const seriesData = await axios.get(`http://www.omdbapi.com/?type=series&apikey=${OMDB_API_KEY}&t=${req.params.seriesName}`);
		const series ={
			title: seriesData.data.Title,
			plot: seriesData.data.Plot,
			year: seriesData.data.Year,
			thumbnail: seriesData.data.Poster,
			rate: seriesData.data.Ratings[0].Value
		};
		res.send(series);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.post('/series', async function(req, res) {
	try {
		const series = new Series({ ...req.body });
		await series.save();
		res.send(series);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.get('/serieses/data/:seriesId', async function(req, res) {
	try {
		const series = await Series.findOne({ _id: req.params.seriesId });
		res.send(series);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.put('/series/:seriesId', async function(req, res) {
	try {
		const obj = req.body;
		const series = await Series.findByIdAndUpdate(req.params.seriesId, {$set: obj}, {new: true});
		res.send(series);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});

router.delete('/serieses/:seriesId', async function(req, res) {
	try {
		const series = await Series.findByIdAndRemove({ _id: req.params.seriesId });
		res.send(series);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF SERIES SCHEME */

/* GET COUNT */
router.get('/count/:categoryName', async function(req, res) {
	try {
		let count;
		switch (req.params.categoryName) {
			case "books":
				count = await Book.countDocuments({});
				break;
			case "links":
				count = await Link.countDocuments({});
				break;
			case "movies":
				count = await Movie.countDocuments({});
				break;
			case "serieses":
				count = await Series.countDocuments({});
				break;
			case "youtubes":
				count = await Youtube.countDocuments({});
				break;
			case "notes":
				count = await Note.countDocuments({});
				break;
			case "photos":
				count = await Photo.countDocuments({});
				break;
			case "quotes":
				count = await Quote.countDocuments({});
				break;
			case "recipes":
				count = await Recipe.countDocuments({});
				break;
			case "restaurants":
				count = await Restaurant.countDocuments({});
				break;
		}
		res.json(count);
	}
	catch (error) {
		console.log(error);
		res.send(null);
	}
});
/* END OF COUNT */


module.exports = router;