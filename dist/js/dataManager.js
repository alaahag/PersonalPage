class User {
	RegisterUser(registrationData) {
		$.post('/user/register', registrationData, (user) => {
			if (user.length !== 0) {
				Notify.success({
					title: 'Registration Complete!',
					html: `<b>${user.userName}</b> has been registered successfully.`
				});
				$("#register").modal('close');
				$("#login").modal('open');
			}
			else {
				Notify.error({
					title: 'Failed Registration',
					html: 'Invalid data or user is already taken!'
				});
			}
		});
	}

	async userMode(userName) {
		await $.ajax({
			url: `/update/${userName}`,
			method: "PUT"
		});
	}

	LoginUser(loginData) {
		$.post('/user/login', loginData, function(user) {
			if (user.length !== 0) {
				Notify.success({
					title: 'Welcome User',
					html: `Welcome back <b>${user.userName}</b> :)`
				});
				$("#login").modal('close');
				checkIfLoggedIn();
			}
			else {
				Notify.error({
					title: 'Invalid Data',
					html: 'Invalid username or password!'
				});
			}
		});
	}

	async getSession() {
		return await $.get('/session');
	}
}
class Category {
	constructor() {
	}

	async getCount(categoryName) {
		return await $.get(`/count/${categoryName}`);
	}

	async get(categoryName, sess) {
		return await $.get(`/${categoryName}/${sess}`);
	}

	async getID(categoryName, id) {
		return await $.get(`/${categoryName}/data/${id}`);
	}

	async save(categoryName, data) {
		return await $.post(`/${categoryName}`, data);
	}

	async update(categoryName, data, id) {
		let results = null;
		try {
			results = await $.ajax({
				url: `/${categoryName}/${id}`,
				dataType: 'json',
				data: data,
				method: "PUT"
			});
			Notify.success({
				title: "Update Succeed",
				html: `<b>${results.title}</b> has been successfully updated.`
			});
		}
		catch (e) {
			Notify.error({
				title: "Update Failed",
				html: "Failed updating data!"
			});
		}

		return await results;
	}

	async remove(categoryName, itemId) {
		let results = null;
		try {
			results = await $.ajax({
				url: `/${categoryName}/${itemId}`,
				method: "DELETE"
			});
			Notify.success({
				title: "Deleted",
				html: `<b>${results.title}</b> has been successfully deleted.`
			});
		}
		catch (e) {
			Notify.error({
				title: "Deletion Failed",
				html: "Failed deleting data!"
			});
		}

		return await results;
	}
}

class APIs {
	async getWeather(lat, long) {
		return await $.get(`/weather/${lat}/${long}`);
	}
	async getBook(bookName) {
		return await $.get(`/book/${bookName}`);
	}
	async getMovie(movieName) {
		return await $.get(`/movie/${movieName}`);
	}
	async getSeries(seriesName) {
		return await $.get(`/series/${seriesName}`);
	}
	async generateQuote() {
		return await $.get('/quote');
	}
}