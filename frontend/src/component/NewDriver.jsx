import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import Api from '../services/Api';

export default class NewDriver extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: props.user || null,
			name: null,
			phone_number: null,
			email: null,
			password: null,
			responseMessage: null,
			responseStatus: null,
			redirect: null,
		};
		this.api = new Api();
	}

	changeHandler = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	createDriver() {
		const { name, phone_number, email, password } = this.state;
		// set loading state
		this.setState({ isLoading: true });
		// create driver on server
		return this.api.fetch
			.post('drivers/new', {
				name,
				phone_number,
				email,
				password,
			})
			.then((driver) => {
				this.setState({
					isLoading: false,
				});
				this.props.history.push('/drivers');
			});
	}

	render() {
		if (this.state.redirect) {
			return (
				<Router>
					<Redirect to={this.state.redirect} />
				</Router>
			);
		}

		const { isLoading } = this.state;

		return (
			<div className="container">
				<div className="py-4 d-flex flex-column w-full">
					<div className="d-flex align-items-center justify-content-between">
						<h3 className="mb-3">New Driver</h3>
					</div>
					<Form>
						<Form.Group controlId="formGroupName">
							<Form.Label>Name</Form.Label>
							<Form.Control
								name="name"
								type="text"
								placeholder="Enter driver's name"
								className="mb-2"
								onChange={this.changeHandler}
							/>
						</Form.Group>
						<Form.Group controlId="formGroupEmail">
							<Form.Label>Email</Form.Label>
							<Form.Control
								name="email"
								type="text"
								placeholder="Enter driver's email"
								className="mb-2"
								onChange={this.changeHandler}
							/>
						</Form.Group>
						<Form.Group controlId="formGroupPhone">
							<Form.Label>Phone</Form.Label>
							<Form.Control
								name="phone_number"
								type="text"
								placeholder="Enter driver's phone number"
								className="mb-2"
								onChange={this.changeHandler}
							/>
						</Form.Group>
						<Form.Group controlId="formGroupPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								name="password"
								type="text"
								placeholder="Enter a password for the driver"
								className="mb-2"
								onChange={this.changeHandler}
							/>
						</Form.Group>
						<Form.Group controlId="submitButton">
							<Button
								variant="primary"
								disabled={isLoading}
								block
								onClick={this.createDriver.bind(this)}
							>
								{isLoading ? 'Creating new driver...' : 'Submit'}
							</Button>
						</Form.Group>
					</Form>
				</div>
			</div>
		);
	}
}
