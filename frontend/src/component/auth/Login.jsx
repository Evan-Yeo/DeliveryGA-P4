import React, { Component } from 'react';
import { Row, Form, Button, Container } from 'react-bootstrap';
import AuthService from '../../services/Auth';

export default class Login extends Component {
	state = {
		email: '',
		password: '',
		error: null,
	};

	changeHandler = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	loginHandler = async () => {
		const { email, password } = this.state;

		try {
			const response = await AuthService.authenticate(email, password);
		} catch (Error) {
			this.setState({
				error: Error,
			});
			return;
		}

		this.props.updateApplicationState({
			isAuth: true,
			// user: response.user,
		});

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
		return (
			<div class="container">
				<div class="py-4 d-flex justify-content-center align-items-center w-full">
					<div class="login-container border border-light rounded shadow-sm w-50 px-4 py-2">
						<h3 class="mb-3">Login</h3>
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
								<Button variant="primary" block onClick={this.loginHandler}>
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
