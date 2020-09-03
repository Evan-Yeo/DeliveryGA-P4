import React, { Component } from 'react';
import {
	Switch,
	BrowserRouter as Router,
	Route,
	Redirect,
} from 'react-router-dom';
import { createBrowserHistory } from "history";
import logo from './logo.svg';
import './App.css';
import Home from './component/Home';
import NewOrder from './component/NewOrder';
import Order from './component/Order';
import Drivers from './component/Drivers';
import NewDriver from './component/NewDriver';
import Navigation from './component/Navigation';
import PrivateRoute from './component/PrivateRoute';
import Register from './component/auth/Register';
import Login from './component/auth/Login';
import { Alert } from 'react-bootstrap';
import AuthService from './services/Auth';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessage: null,
			isAuth: false,
			user: null,
			redirect: null,
		};
		this.authService = new AuthService();
		this.history = createBrowserHistory();
	}

	mounted = false;

	componentWillMount() {
		this.mounted = true;
		this.restoreSession();
	}
	componentWillUnmount() {
		this.mounted = false;
	}

	async restoreSession() {
		if (this.mounted) {
			try {
				await this.authService.restore();
			} catch (Error) {
				console.log(Error);
			}

			if (this.authService.isAuthenticated) {
				this.setState({
					isAuth: true,
				});

				// load current user
				const user = await this.authService.loadCurrentUser();

				this.setState({
					user
				});
			}
		}
	}

	logout() {
		return this.authService.invalidate().then(() => {
			this.setState({
				isAuth: false,
				user: null
			});
			this.history.push('/login');
		});
	}

	updateApplicationState(props = {}) {
		this.setState(props);
	}

	render() {
		if (this.state.redirect) {
			return (
				<Router>
					<Redirect to={this.state.redirect} />
				</Router>
			);
		}

		let { isAuth, user, errorMessage } = this.state;
		return (
			<Router history={this.history}>
				<Navigation user={user} logout={this.logout.bind(this)} />
				{errorMessage && (
					<Alert className="error-message">{errorMessage}</Alert>
				)}
				<Switch>
					<PrivateRoute
						exact
						path="/"
						isAuth={isAuth}
						user={user}
						component={Home}
					/>
					<PrivateRoute
						exact
						path="/order/:id"
						isAuth={isAuth}
						user={user}
						component={Order}
					/>
					<PrivateRoute
						exact
						path="/new-order"
						isAuth={isAuth}
						user={user}
						history={this.history}
						component={NewOrder}
					/>
					<PrivateRoute
						exact
						path="/drivers"
						isAuth={isAuth}
						user={user}
						component={Drivers}
					/>
					<PrivateRoute
						exact
						path="/new-driver"
						isAuth={isAuth}
						user={user}
						history={this.history}
						component={NewDriver}
					/>
					<Route path="/register" exact render={() => <Register />} />
					<Route
						path="/login"
						exact
						render={() =>
							isAuth ? (
								<Redirect to="/" />
							) : (
								<Login
									updateApplicationState={this.updateApplicationState.bind(
										this
									)}
								/>
							)
						}
					/>
				</Switch>
			</Router>
		);
	}
}

export default App;
