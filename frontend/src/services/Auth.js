import Fetch from './Fetch';

const API_URL = process.env.REACT_APP_API_URL;

export default class AuthService {
	constructor() {
		const token = this.getAuthToken();
		this.fetch = new Fetch(API_URL, 'api');
		if (token) {
			this.setAuthToken(token);
		}
	}

	isAuthenticated = false;
	user = null;

	getAuthToken() {
		return localStorage.getItem('token');
	}

	getSessionData() {
		const token = localStorage.getItem('token');
		return { token };
	}

	setAuthToken(token) {
		localStorage.setItem('token', token);
		this.fetch.setHeaders({
			'x-auth-token': token,
		});
	}

	getCurrentUser() {
		const currentUser = localStorage.getItem('currentUser'); 
		if(currentUser) {
			return JSON.parse(currentUser);
		}
		return false;
	}

	setUser(user) {
		const currentUser = this.getCurrentUser();
		if(!currentUser) {
			localStorage.setItem('currentUser', JSON.stringify(user));
		}
		this.user = user;
		this.id = user.id;
		return user;
	}

	register(user) {
		return this.fetch.post('auth/register', user).then((response) => {
			if (response.error) {
				return Promise.reject(
					new Error(response.error || 'Registration failed')
				);
			}
			this.setAuthToken(response.token);
			this.isAuthenticated = true;
			return this.loadCurrentUser();
		});
	}

	authenticate(email, password) {
		return this.fetch
			.post('auth/login', { email, password })
			.then((response) => {
				if (response.error) {
					return Promise.reject(
						new Error(response.error || 'Authentication failed')
					);
				}
				this.setAuthToken(response.token);
				this.isAuthenticated = true;
				return this.loadCurrentUser();
			});
	}

	restore() {
		return new Promise( (resolve,reject) => {
			const {token} = this.getSessionData();
			const authenticate = (token) => {
				this.setAuthToken(token);
				this.isAuthenticated = true;
				return resolve(true);
			}
			if(token) {
				return authenticate(token);
			}
			return this.fetch.get('auth/session').then((response) => {
				if (response.error) {
					return reject(
						new Error(response.error || 'Session ended')
					);
				}
				if (response.token === token) {
					return authenticate(response.token);
				}
				return reject(
					new Error(response)
				);
			});
		});
	}

	invalidate() {
		return this.fetch.post('auth/logout').then((response) => {
			localStorage.removeItem('token');
			localStorage.removeItem('currentUser');
		});
	}

	loadCurrentUser() {
		const currentUser = this.getCurrentUser();
		if(currentUser) {
			return this.setUser(currentUser);
		}
		return this.fetch.get('auth/me').then(({ user, error }) => {
			if (user) {
				return this.setUser(user);
			}
			return Promise.reject(new Error(error || 'Session has ended.'));
		});
	}
}
