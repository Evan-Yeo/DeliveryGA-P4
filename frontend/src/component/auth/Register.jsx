import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthService from '../../services/Auth';

export default class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			company: '',
			email: '',
			password: '',
			error: null,
		};

		this.authService = new AuthService();
	}

	changeHandler = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	createAccount = async () => {
		const { name, company, email, password } = this.state;
		try {
			await this.authService.register({ name, company, email, password });
		} catch (Error) {
			this.setState({
				error: Error,
			});
		}
	};

	render() {
		let { error } = this.state;
		return (
			<div className="container">
				<div className="py-4 d-flex flex-column justify-content-center align-items-center w-full">
					{error && <Alert className="alert-danger">{error.message}</Alert>}
					<div className="register-container border border-light rounded shadow-sm w-50 px-4 py-2">
						<h3 className="mb-3">Register</h3>
						<Form>
							<Form.Group controlId="formGroupName">
								<Form.Label>Name</Form.Label>
								<Form.Control
									name="name"
									type="text"
									placeholder="Enter your name"
									onChange={this.changeHandler}
								/>
							</Form.Group>
							<Form.Group controlId="formGroupCompany">
								<Form.Label>Company Name</Form.Label>
								<Form.Control
									name="company"
									type="text"
									placeholder="Enter company name"
									onChange={this.changeHandler}
								/>
							</Form.Group>
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
								<Button
									variant="primary"
									block
									onClick={this.createAccount.bind(this)}
								>
									Register
								</Button>
							</Form.Group>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}
