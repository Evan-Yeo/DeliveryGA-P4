import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthService from '../../services/Auth';

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			error: null,
		};

		this.authService = new AuthService();
	}

	changeHandler = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	login = async () => {
		const { email, password } = this.state;

		try {
			await this.authService.authenticate(email, password);
		} catch (Error) {
			return this.setState({
				error: Error,
			});
		}

		console.log('isAuthenticated', this.authService.isAuthenticated);

		if (this.authService.isAuthenticated) {
			this.props.updateApplicationState({
				isAuth: true,
				user: this.authService.user,
			});
		}

		//     //
		//     localStorage.setItem("token", res.data.token);
		//     this.getUserProfile(res.data.token); //get uptodate user information

		//     this.setState({
		//       isAuth: true,
		//     });
		//   })
		//   .catch((err) => {
		//     // console.log(err);
		//     this.setState({
		//       isAuth: false,
		//       // errorMessage: err.response.data.message,
		//     });
		//   });
	};

	render() {
		let { error } = this.state;
		return (
			<div className="container">
				<div className="py-4 d-flex flex-column justify-content-center align-items-center w-full">
					{error && <Alert className="alert-danger">{error.message}</Alert>}
					<div className="login-container border border-light rounded shadow-sm w-50 px-4 py-2">
						<h3 className="mb-3">Login</h3>
						<Form>
							<Form.Group controlId="formGroupEmail">
								<Form.Label>Email address</Form.Label>
								<Form.Control
									name="email"
									type="email"
									placeholder="Enter email"
									className="mb-2"
									onChange={this.changeHandler}
								/>
							</Form.Group>
							<Form.Group controlId="formGroupPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control
									name="password"
									type="password"
									placeholder="Password"
									onChange={this.changeHandler}
								/>
							</Form.Group>
							<Form.Group controlId="submitButton">
								<Button variant="primary" block onClick={this.login}>
									Login
								</Button>
							</Form.Group>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}
