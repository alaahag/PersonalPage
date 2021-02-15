let SESSION;
const user = new User();
const categoryInfo = new Category();
const getAPIs = new APIs();
const renderer = new Renderer();

const getActiveCategoryName = function() {
	let categoryName = $("#navs").find(".active .menu_item_text").text().toLowerCase();
	if (categoryName === "series")
		categoryName = "serieses";

	return categoryName;
};

$("#link_to_register").on("click", function() {
	$("#register").modal({ dismissible: false });
	$("#register").modal("open");
	$("#login").modal("close");
});

$("#link_back_to_login").on("click", function() {
	$("#login").modal({ dismissible: false });
	$("#login").modal("open");
	$("#register").modal("close");
});

$("#form_login").on("submit", async() => {
	const loginData = {
		userName: $("#login_username").val(),
		password: $("#login_password").val()
	};
	await user.LoginUser(loginData);
	return false;
});

$("#form_register").on("submit", async() => {
	const userData = {
		userName: $("#register_username").val(),
		password: $("#register_password").val(),
		isPublic: $("#ispublic_register").prop("checked"),
		isDarkMode: false
	};
	await user.RegisterUser(userData);
	return false;
});

const currentWeather = () => {
	async function success(pos) {
		const coords = await pos.coords;
		const weatherInfo = await getAPIs.getWeather(coords.latitude, coords.longitude);
		$("#weather").append(`<b>${weatherInfo.temperature}°C</b>`);
	}
	navigator.geolocation.getCurrentPosition(success);
};

const renderCount = async function(categoryName) {
	if (categoryName === "series")
		categoryName = "serieses";

	const count = await categoryInfo.getCount(categoryName);
	renderer.renderCount(count, "#" + categoryName);
};

const renderContent = async function(categoryName) {
	if (categoryName === "series")
		categoryName = "serieses";

	const data = await categoryInfo.get(categoryName, SESSION.userName);
	renderer.renderData(data, "#" + categoryName + "-template");
	await renderCount(categoryName);
};

// login + continuous session done
const viewByCategory = function() {
	renderMode();
	$('.menu_item_text').each(function() {renderCount($(this).text().toLowerCase());});
	$("#menu_username").text(SESSION.userName);
	setTimeout(currentWeather, 2000);
};

const checkIfLoggedIn = async() => {
	const ses = await user.getSession();
	if (ses.length !== 0) {
		SESSION = ses;
		viewByCategory();
	}
	else {
		$("#login").modal({ dismissible: false });
		$("#login").modal("open");
	}
};

$("#logout").on("click", function() {
	$.get("/sessionDelete", function() {
		location.reload();
	});
});

const openModalData = function(data) {
	const categoryName = getActiveCategoryName();
	switch (categoryName) {
		case "books":
			const modal_add_book = $("#modal_add_book");
			modal_add_book.modal();
			modal_add_book.modal('open');
			if (data) {
				modal_add_book.attr('data-id', data._id);
				$("#add_book_author").val(data.author).trigger("focus");
				$("#add_book_description").val(data.description).trigger("focus");
				$("#add_book_thumbnail").val(data.thumbnail).trigger("focus");
				$("#add_book_title").val(data.title).trigger("focus");
			}
			break;

		case "links":
			const modal_add_link = $("#modal_add_link");
			modal_add_link.modal();
			modal_add_link.modal('open');
			if (data) {
				modal_add_link.attr('data-id', data._id);
				$("#add_link").val(data.link).trigger("focus");
				$("#add_link_description").val(data.description).trigger("focus");
				$("#add_link_title").val(data.title).trigger("focus");
			}
			break;

		case "movies":
			const modal_add_movie = $("#modal_add_movie");
			modal_add_movie.modal();
			modal_add_movie.modal('open');
			if (data) {
				modal_add_movie.attr('data-id', data._id);
				$("#add_movie_plot").val(data.plot).trigger("focus");
				$("#add_movie_year").val(data.year).trigger("focus");
				$("#add_movie_thumbnail").val(data.thumbnail).trigger('focus');
				$("#add_movie_rate").val(data.rate).trigger("focus");
				$("#add_movie_title").val(data.title).trigger("focus");
			}
			break;

		case "serieses":
			const modal_add_series = $("#modal_add_series");
			modal_add_series.modal();
			modal_add_series.modal('open');
			if (data) {
				modal_add_series.attr('data-id', data._id);
				$("#add_series_plot").val(data.plot).trigger("focus");
				$("#add_series_year").val(data.year).trigger("focus");
				$("#add_series_thumbnail").val(data.thumbnail).trigger('focus');
				$("#add_series_rate").val(data.rate).trigger("focus");
				$("#add_series_title").val(data.title).trigger("focus");
			}
			break;

		case "youtubes":
			const modal_add_youtube = $("#modal_add_youtube");
			modal_add_youtube.modal();
			modal_add_youtube.modal('open');
			if (data) {
				modal_add_youtube.attr('data-id', data._id);
				$("#add_youtube_description").val(data.description).trigger("focus");
				$("#add_youtube_url").val(data.link).trigger("focus");
				$("#add_youtube_title").val(data.title).trigger("focus");
			}
			break;

		case "notes":
			const modal_add_note = $("#modal_add_note");
			modal_add_note.modal();
			modal_add_note.modal('open');
			if (data) {
				modal_add_note.attr('data-id', data._id);
				addNote.container.firstChild.innerHTML = data.note;
				$("#add_note_title").val(data.title).trigger("focus");
			}
			break;

		case "photos":
			const modal_add_photo = $("#modal_add_photo");
			modal_add_photo.modal();
			modal_add_photo.modal('open');
			if (data) {
				modal_add_photo.attr('data-id', data._id);
				$("#add_photo_description").val(data.description).trigger("focus");
				$("#add_photo_photo").val(data.photo).trigger("focus");
				$("#add_photo_title").val(data.title).trigger("focus");
			}
			break;

		case "quotes":
			const modal_add_quote = $("#modal_add_quote");
			modal_add_quote.modal();
			modal_add_quote.modal('open');
			if (data) {
				modal_add_quote.attr('data-id', data._id);
				$("#add_quote_author").val(data.author).trigger("focus");
				$("#add_quote_title").val(data.title).trigger("focus");
			}
			break;

		case "recipes":
			const modal_add_recipe = $("#modal_add_recipe");
			modal_add_recipe.modal();
			modal_add_recipe.modal('open');
			if (data) {
				modal_add_recipe.attr('data-id', data._id);
				$("#add_recipe_thumbnail").val(data.thumbnail).trigger("focus");
				addRecipeDesc.container.firstChild.innerHTML = data.description;
				$("#add_recipe_title").val(data.title).trigger("focus");
			}
			break;

		case "restaurants":
			const modal_add_restaurant = $("#modal_add_restaurant");
			modal_add_restaurant.modal();
			modal_add_restaurant.modal('open');
			if (data) {
				modal_add_restaurant.attr('data-id', data._id);
				$("#add_restaurant_thumbnail").val(data.thumbnail).trigger("focus");
				addRestaurantDesc.container.firstChild.innerHTML = data.description;
				$("#add_restaurant_title").val(data.title).trigger("focus");
			}
			break;

		default:
			Notify.alert({
				title: "Invalid Category",
				html: "Select a category."
			});
	}
};

$("#floating_add_new_item").on('click', function() {
	openModalData(null);
});

const renderMode = function() {
	if(SESSION.isDarkMode) {
		$('body').css("background-color","grey");
		$('#isDarkMode').prop("checked", true);
	}
	else {
		$('body').css("background-color","white");
	}
};

const updateMode = function() {
	user.userMode(SESSION.userName);
	SESSION.isDarkMode = !SESSION.isDarkMode;
	renderMode();
};

$("#isDarkMode").on('click', updateMode);

$("#navs").on('click', '.text_floating_remove_btn', async function() {
	Notify.confirm({
		title: "Confirm Deletion",
		html: "Are you sure you want to delete this selected item?",
		ok : async () => {
			const category = getActiveCategoryName();
			const id = $('#content').find(this).closest('.' + category).attr('data-id');

			const isRemoved = await categoryInfo.remove(category, id);
			if (isRemoved)
				await renderContent(category);
			else {
				Notify.error({
					title: "Failed Deletion",
					html: "Failed to remove selected item!"
				});
			}
		}
	});
});

$("#navs").on('click', '.text_floating_edit_btn', async function() {
	const category = getActiveCategoryName();
	const id = $('#content').find(this).closest('.' + category).attr('data-id');
	const data = await categoryInfo.getID(category, id);
	openModalData(data);
});

$("#btn_search").on("click", function() {
	alert("TODO");
});

$(".menu_item").on("click", function() {
	$(".menu_item").removeClass("active");
	$(this).addClass("active");
	//show category items
	renderContent(getActiveCategoryName());
});

$("#form_modal_find_book").on("submit", async() => {
	const bookName = encodeURI($("#txt_find_book").val());
	const books = await getAPIs.getBook(bookName);

	if (books[0]){
		$("#add_book_author").val(books[0].author[0]).trigger('focus');
		$("#add_book_description").val(books[0].description).trigger('focus');
		$("#add_book_thumbnail").val(books[0].thumbnail).trigger('focus');
		$("#add_book_title").val(books[0].title).trigger('focus');
	}

	return false;
});

$("#form_modal_add_book").on("submit", async() => {
	const bookData = {
		title: $("#add_book_title").val(),
		author: $("#add_book_author").val(),
		description: $("#add_book_description").val(),
		thumbnail: $("#add_book_thumbnail").val(),
		userName: SESSION.userName
	};

	const id = $("#modal_add_book").attr("data-id");
	let book;
	if (id)
		book = await categoryInfo.update("book", bookData, id);
	else
		book = await categoryInfo.save("book", bookData);

	if (book.length !== 0) {
		if (id) {
			Notify.success({
				title: "Book Updated",
				html: `"${book.title}" has been successfully updated.`
			});
		}
		else {
			Notify.success({
				title: "Book Added",
				html: `"${book.title}" has been successfully added.`
			});
		}
		await renderContent("books");
		$("#modal_add_book").modal("close").find("input").val('');
	}
	else {
		Notify.error({
			title: "Invalid Data",
			html: "Invalid parameters!"
		});
	}
	return false;
});

$("#form_modal_find_movie").on("submit", async() => {
	const movieName = encodeURI($("#txt_find_movie").val());
	const movie = await getAPIs.getMovie(movieName);
	if (movie){
		$("#add_movie_plot").val(movie.plot).trigger("focus");
		$("#add_movie_year").val(movie.year).trigger("focus");
		$("#add_movie_thumbnail").val(movie.thumbnail).trigger("focus");
		$("#add_movie_rate").val(parseFloat(movie.rate)).trigger("focus");
		$("#add_movie_title").val(movie.title).trigger("focus");
	}
	return false;
});

$("#form_modal_add_movie").on('submit', async() => {
	const movieData = {
		title: $("#add_movie_title").val(),
		plot: $("#add_movie_plot").val(),
		year: $("#add_movie_year").val(),
		thumbnail: $("#add_movie_thumbnail").val(),
		rate: $("#add_movie_rate").val(),
		userName: SESSION.userName
	};

	const id = $("#modal_add_movie").attr("data-id");
	let movie;
	if (id)
		movie = await categoryInfo.update("movie", movieData, id);
	else
		movie = await categoryInfo.save("movie", movieData);

	if (movie.length !== 0) {
		if (id) {
			Notify.success({
				title: "Movie Updated",
				html: `"${movie.title}" has been successfully updated.`
			});
		}
		else {
			Notify.success({
				title: "Movie Added",
				html: `"${movie.title}" has been successfully added.`
			});
		}
		await renderContent("movies");
		$("#modal_add_movie").modal("close").find("input").val('');
	}
	else {
		Notify.error({
			title: "Invalid Data",
			html: "Invalid parameters!"
		});
	}
	return false;
});

$("#form_modal_find_series").on("submit", async() => {
	const seriesName = encodeURI($("#txt_find_series").val());
	const series = await getAPIs.getSeries(seriesName);
	if (series){
		$("#add_series_plot").val(series.plot).trigger("focus");
		$("#add_series_year").val(series.year).trigger("focus");
		$("#add_series_thumbnail").val(series.thumbnail).trigger("focus");
		$("#add_series_rate").val(parseFloat(series.rate)).trigger("focus");
		$("#add_series_title").val(series.title).trigger("focus");
	}
	return false;
});

$("#form_modal_add_series").on('submit', async() => {
	const seriesData = {
		title: $("#add_series_title").val(),
		plot: $("#add_series_plot").val(),
		year: $("#add_series_year").val(),
		thumbnail: $("#add_series_thumbnail").val(),
		rate: $("#add_series_rate").val(),
		userName: SESSION.userName
	};

	const id = $("#modal_add_series").attr("data-id");
	let series;
	if (id)
		series = await categoryInfo.update("series", seriesData, id);
	else
		series = await categoryInfo.save("series", seriesData);

	if (series.length !== 0) {
		if (id) {
			Notify.success({
				title: "Series Updated",
				html: `"${series.title}" has been successfully updated.`
			});
		}
		else {
			Notify.success({
				title: "Series Added",
				html: `"${series.title}" has been successfully added.`
			});
		}
		await renderContent("serieses");
		$("#modal_add_series").modal("close").find("input").val('');
	}
	else {
		Notify.error({
			title: "Invalid Data",
			html: "Invalid parameters!"
		});
	}
	return false;
});

$("#form_modal_add_link").on("submit", async() => {
	const linkData = {
		title: $("#add_link_title").val(),
		link: $("#add_link").val(),
		description: $("#add_link_description").val(),
		userName: SESSION.userName
	};

	const id = $("#modal_add_link").attr("data-id");
	let link;
	if (id)
		link = await categoryInfo.update("link", linkData, id);
	else
		link = await categoryInfo.save("link", linkData);

	if (link.length !== 0) {
		if (id) {
			Notify.success({
				title: "Link Updated",
				html: `"${link.title}" has been successfully updated.`
			});
		}
		else {
			Notify.success({
				title: "Link Added",
				html: `"${link.title}" has been successfully added.`
			});
		}
		await renderContent("links");
		$("#modal_add_link").modal("close").find("input").val('');
	}
	else {
		Notify.error({
			title: "Invalid Data",
			html: "Invalid parameters!"
		});
	}
	return false;
});

$("#form_modal_add_note").on("submit", async() => {
	const noteData = {
		title: $("#add_note_title").val(),
		note: addNote.container.firstChild.innerHTML,
		userName: SESSION.userName
	};

	const id = $("#modal_add_note").attr("data-id");
	let note;
	if (id)
		note = await categoryInfo.update("note", noteData, id);
	else
		note = await categoryInfo.save("note", noteData);

	if (note.length !== 0) {
		if (id) {
			Notify.success({
				title: "Note Updated",
				html: `"${note.title}" has been successfully updated.`
			});
		}
		else {
			Notify.success({
				title: "Note Added",
				html: `"${note.title}" has been successfully added.`
			});
		}
		await renderContent("notes");
		$("#modal_add_note").modal("close").find("input").val('');
		$(".ql-editor").empty();
	}
	else {
		Notify.error({
			title: "Invalid Data",
			html: "Invalid parameters!"
		});
	}
	return false;
});

$("#form_modal_add_photo").on("submit", async() => {
	const photoData = {
		title: $("#add_photo_title").val(),
		description: $("#add_photo_description").val(),
		photo: $("#add_photo_photo").val(),
		userName: SESSION.userName
	};

	const id = $("#modal_add_photo").attr("data-id");
	let photo;
	if (id)
		photo = await categoryInfo.update("photo", photoData, id);
	else
		photo = await categoryInfo.save("photo", photoData);

	if (photo.length !== 0) {
		if (id) {
			Notify.success({
				title: "Photo Updated",
				html: `"${photo.title}" has been successfully updated.`
			});
		}
		else {
			Notify.success({
				title: "Photo Added",
				html: `"${photo.title}" has been successfully added.`
			});
		}
		await renderContent("photos");
		$("#modal_add_photo").modal("close").find("input").val('');
	}
	else {
		Notify.error({
			title: "Invalid Data",
			html: "Invalid parameters!"
		});
	}
	return false;
});

$("#form_modal_add_quote").on("submit", async() => {
	const quoteData = {
		title: $("#add_quote_title").val(),
		author: $("#add_quote_author").val(),
		userName: SESSION.userName
	};

	const id = $("#modal_add_quote").attr("data-id");
	let quote;
	if (id)
		quote = await categoryInfo.update("quote", quoteData, id);
	else
		quote = await categoryInfo.save("quote", quoteData);

	if (quote.length !== 0) {
		if (id) {
			Notify.success({
				title: "Quote Updated",
				html: `"${quote.title}" has been successfully updated.`
			});
		}
		else {
			Notify.success({
				title: "Quote Added",
				html: `"${quote.title}" has been successfully added.`
			});
		}
		await renderContent("quotes");
		$("#modal_add_quote").modal("close").find("input").val('');
	}
	else {
		Notify.error({
			title: "Invalid Data",
			html: "Invalid parameters!"
		});
	}
	return false;
});

$("#form_modal_add_recipe").on("submit", async() => {
	const recipeData = {
		title: $("#add_recipe_title").val(),
		description: addRecipeDesc.container.firstChild.innerHTML,
		thumbnail: $("#add_recipe_thumbnail").val(),
		userName: SESSION.userName
	};

	const id = $("#modal_add_recipe").attr("data-id");
	let recipe;
	if (id)
		recipe = await categoryInfo.update("recipe", recipeData, id);
	else
		recipe = await categoryInfo.save("recipe", recipeData);

	if (recipe.length !== 0) {
		if (id) {
			Notify.success({
				title: "Recipe Updated",
				html: `"${recipe.title}" has been successfully updated.`
			});
		}
		else {
			Notify.success({
				title: "Recipe Added",
				html: `"${recipe.title}" has been successfully added.`
			});
		}
		await renderContent("recipes");
		$("#modal_add_recipe").modal("close").find("input").val('');
		$(".ql-editor").empty();
	}
	else {
		Notify.error({
			title: "Invalid Data",
			html: "Invalid parameters!"
		});
	}
	return false;
});

$("#form_modal_add_restaurant").on("submit", async() => {
	const restaurantData = {
		title: $("#add_restaurant_title").val(),
		description: addRestaurantDesc.container.firstChild.innerHTML,
		thumbnail: $("#add_restaurant_thumbnail").val(),
		userName: SESSION.userName
	};

	const id = $("#modal_add_restaurant").attr("data-id");
	let restaurant;
	if (id)
		restaurant = await categoryInfo.update("restaurant", restaurantData, id);
	else
		restaurant = await categoryInfo.save("restaurant", restaurantData);

	if (restaurant.length !== 0) {
		if (id) {
			Notify.success({
				title: "Restaurant Updated",
				html: `"${restaurant.title}" has been successfully updated.`
			});
		}
		else {
			Notify.success({
				title: "Restaurant Added",
				html: `"${restaurant.title}" has been successfully added.`
			});
		}
		await renderContent("restaurants");
		$("#modal_add_restaurant").modal("close").find("input").val('');
		$(".ql-editor").empty();
	}
	else {
		Notify.error({
			title: "Invalid Data",
			html: "Invalid parameters!"
		});
	}
	return false;
});

const getYoutubeId = (message) => {
	const regexp = /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)(?<id>([\w\-]+)(\S+)?)/g;
	const exec = regexp.exec(message);
	return exec && exec.groups && exec.groups.id;
};

$("#form_modal_add_youtube").on("submit", async() => {
	const youtubeData = {
		title: $("#add_youtube_title").val(),
		description: $("#add_youtube_description").val(),
		link: $("#add_youtube_url").val(),
		userName: SESSION.userName
	};

	const id = $("#modal_add_youtube").attr("data-id");
	let youtube;
	if (id)
		youtube = await categoryInfo.update("youtube", youtubeData, id);
	else
		youtube = await categoryInfo.save("youtube", youtubeData);

	const youtubeID = getYoutubeId(youtubeData.link);
	if (youtubeID) {
		youtubeData.link = "https://www.youtube.com/embed/" + youtubeID;
		if (id) {
			Notify.success({
				title: "Youtube Video Updated",
				html: `"${youtube.title}" has been successfully updated.`
			});
		}
		else {
			Notify.success({
				title: "Youtube Video Added",
				html: `"${youtube.title}" has been successfully added.`
			});
		}
		await renderContent("youtubes");
		$("#modal_add_youtube").modal("close").find("input").val('');
	}
	else {
		Notify.error({
			title: "Invalid Data",
			html: "Invalid parameters!"
		});
	}
	return false;
});

const addRestaurantDesc = new Quill('#add_restaurant_description', {
	modules: {
		toolbar: [
			['bold', 'italic', 'underline', 'strike'],
			['link', 'blockquote', 'code-block'],
			[{'list': 'ordered'}, {'list': 'bullet'}],
			[{'indent': '-1'}, {'indent': '+1'}]
		]
	},
	placeholder: 'Restaurant description here...',
	theme: 'snow'
});

const addRecipeDesc = new Quill('#add_recipe_description', {
	modules: {
		toolbar: [
			['bold', 'italic', 'underline', 'strike'],
			['link', 'blockquote', 'code-block'],
			[{'list': 'ordered'}, {'list': 'bullet'}],
			[{'indent': '-1'}, {'indent': '+1'}]
		]
	},
	placeholder: 'Your recipe here...',
	theme: 'snow'
});

const addNote = new Quill('#add_note_note', {
	modules: {
		toolbar: [
			['bold', 'italic', 'underline', 'strike'],
			['link', 'blockquote', 'code-block'],
			[{'list': 'ordered'}, {'list': 'bullet'}],
			[{'indent': '-1'}, {'indent': '+1'}]
		]
	},
	placeholder: 'Your note here...',
	theme: 'snow'
});

const viewerEditorMode = function() {
	if ($("#viewer_editor_mode").text().includes('Viewer')) {
		$(".text_floating_remove_btn").fadeOut();
		$(".text_floating_edit_btn").fadeOut();
	}
	else {
		$(".text_floating_remove_btn").fadeIn();
		$(".text_floating_edit_btn").fadeIn();
	}
};

$("#viewer_editor_mode").on('click', function() {
	if ($(this).text().includes("Viewer")) {
		$("#floating_add_new_item").fadeIn();
		$(this).text("Editor Mode");
	}
	else {
		$("#floating_add_new_item").fadeOut();
		$(this).text("Viewer Mode");
	}

	viewerEditorMode();
});

$("#btn_generate_quote").on('click', async function() {
	const quoteJSON = await getAPIs.generateQuote();
	$("#add_quote_author").val(quoteJSON.author).trigger('focus');
	$("#add_quote_title").val(quoteJSON.quote).trigger('focus');
});

$(".dropdown-trigger").dropdown();
checkIfLoggedIn();