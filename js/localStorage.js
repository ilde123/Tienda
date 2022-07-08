/*
class LocalStorage {
	constructor() {
		this.storage = window.localStorage;
	}

	get(key) {
		return this.storage.getItem(key);
	}

	set(key, value) {
		this.storage.setItem(key, value);
	}

	remove(key) {
		this.storage.removeItem(key);
	}
}
*/
LocalStorage = {
	get: function (key) {
		return window.localStorage.getItem(key);
	},
	set: function (key, value) {
		window.localStorage.setItem(key, value);
	},
	remove: function (key) {
		window.localStorage.removeItem(key);
	}
}