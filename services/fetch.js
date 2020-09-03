const fetch = require('node-fetch');

const isBlank = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

class Fetch {
	constructor(host, namespace = null) {
		this.host = host;
		this.namespace = namespace;
	}

	/**
	 * The request headers
	 *
	 * @var {Object}
	 */
	headers = {
		'Content-Type': 'application/json',
	};

	setHeaders(headers = {}) {
		this.headers = { ...this.headers, ...headers };
		return this.headers;
	}

	/**
	 * Credentials
	 *
	 * @var {String}
	 */
	credentials = 'include';

	/**
	 * The base request method
	 */
	request(path, method = 'GET', options = {}) {
        console.log(`${method} -> `, `${this.host}${this.namespace ? this.namespace + '/' : ''}${path}`);
		return fetch(
			`${this.host}${this.namespace ? this.namespace + '/' : ''}${path}`,
			{
				method,
				credentials: this.credentials,
				headers: {
					...(this.headers || {}),
					...(options.headers || {}),
				},
				...options,
			}
		).then((response) => {
			// console.log('[fetch:response]', response);
			return response.json();
		});
	}

	/**
	 * Makes a GET request with fetch
	 */
	get(path, query = {}, options = {}) {
		return this.request(
			`${path}?${!isBlank(query) ? new URLSearchParams(query).toString() : ''}`,
			'GET',
			options
		);
	}

	/**
	 * Makes a POST request with fetch
	 */
	post(path, data = {}, options = {}) {
		return this.request(path, 'POST', {
			...options,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Makes a PUT request with fetch
	 */
	put(path, data = {}, options = {}) {
		return this.request(path, 'PUT', {
			...options,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Makes a DELETE request with fetch
	 */
	delete(path, data = {}, options = {}) {
		return this.request(path, 'DELETE', {
			...options,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Makes a PATCH request with fetch
	 */
	patch(path, data = {}, options = {}) {
		return this.request(path, 'PATCH', {
			...options,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Makes a upload request with fetch
	 */
	upload(path, files = [], options = {}) {
		const body = new FormData();
		files.forEach((file) => {
			body.append('file', file);
		});
		return this.request(path, 'POST', { ...options, body });
	}
}

module.exports = Fetch;
