const Fetch = require('./fetch');
const Inflector = require('inflector-js')

const API_KEY = process.env.FLEETBASE_API_KEY;

class Fleetbase {
	constructor() {
		this.fetch = new Fetch('https://api.fleetbase.io/v1/');
		this.fetch.setHeaders({
			'Authorization': API_KEY,
		});
	}

	create(subject, data) {
        subject = Inflector.pluralize(subject);
		return this.fetch.post(subject, data);
	}
}

module.exports = Fleetbase;
