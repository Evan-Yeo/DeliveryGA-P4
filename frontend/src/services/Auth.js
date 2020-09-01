import Fetch from './Fetch';

const API_URL = process.env.API_URL;

export default class AuthService {
    constructor() {
        this.fetch = new Fetch(API_URL);
    }

    authenticate(email, password) {
        // this.post('auth/login', {email, password}).then(response => {
        //     localStorage.setItem('token', response.data.token);
        // });
    }
}