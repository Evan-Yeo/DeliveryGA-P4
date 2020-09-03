import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import Api from '../services/Api';
import getContainerTypes from '../utils/getContainerTypes';
import genId from '../utils/genId';

export default class NewOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: props.user || null,
			pickup: null,
			dropoff: null,
			driver: null,
			drivers: [],
			containers: [],
			order: null,
			isLoading: false,
			containerTypes: getContainerTypes(),
		};
		this.api = new Api();
	}

	componentWillMount() {
		this.mounted = true;
		this.loadDrivers();
	}
	componentWillUnmount() {
		this.mounted = false;
	}

	loadDrivers() {
		if (this.mounted) {
			return this.api.fetch.get('drivers/list').then(({ drivers }) => {
				this.setState({ drivers });
			});
		}
	}

	addContainer() {
		const { containers } = this.state;
		containers.push({
			id: genId(),
			name: 'N/A',
			type: null,
		});
		this.setState({ containers });
	}

	removeContainer(index) {
		const { containers } = this.state;
		delete containers[index];
		this.setState({
			containers,
		});
	}

	updateContainerType(index, event) {
		event.persist();
		console.log(event);
		const { value } = event.target;
		const { containers } = this.state;
		const container = containers[index];
		// get the container type
		const type = getContainerTypes(value);
		console.log(type);
		// set the container name and type
		container.name = type.desc;
		container.type = type.type_size;
		// re-insert updated container
		containers[index] = container;
		// update state
		this.setState({
			containers,
		});
	}

	createOrder() {
		const { pickup, dropoff, driver, containers } = this.state;
		// set loading state
		this.setState({ isLoading: true });
		// create driver on server
		return this.api.fetch
			.post('orders/new', {
				pickup,
				dropoff,
				driver,
				containers,
			})
			.then(() => {
				this.setState({
					isLoading: false,
				});
				this.props.history.push('/');
			});
	}

	changeHandler = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		if (this.state.redirect) {
			return (
				<Router>
					<Redirect to={this.state.redirect} />
				</Router>
			);
		}
		const { containers, containerTypes, drivers, isLoading } = this.state;
		return (
			<div className="container">
				<div className="py-4 d-flex flex-column w-full">
					<div className="d-flex align-items-center justify-content-between">
						<h3 className="mb-3">New Order</h3>
					</div>
					<Form>
						<Form.Group controlId="formGroupPickup">
							<Form.Label>Pickup</Form.Label>
							<Form.Control
								name="pickup"
								type="text"
								placeholder="Enter pickup location"
								className="mb-2"
								onChange={this.changeHandler}
							/>
						</Form.Group>

						<Form.Group controlId="formGroupDropoff">
							<Form.Label>Dropoff</Form.Label>
							<Form.Control
								name="dropoff"
								type="text"
								placeholder="Enter dropoff location"
								className="mb-2"
								onChange={this.changeHandler}
							/>
						</Form.Group>

						<Form.Group controlId="formGroupDriver">
							<Form.Label>Driver</Form.Label>
							<Form.Control
								as="select"
								name="driver"
								className="mb-2"
								defaultValue={'placeholder'}
								onChange={this.changeHandler}
								custom
							>
								<option value="placeholder" disabled>
									Select driver
								</option>
								{drivers.map(function (driver, index) {
									return (
										<option key={driver.id} value={driver.id}>
											{driver.name}
										</option>
									);
								})}
							</Form.Control>
						</Form.Group>

						<Form.Group controlId="formGroupContainers">
							<div className="d-flex align-items-center justify-content-between mb-2">
								<Form.Label>Containers</Form.Label>
								<div className="w-25 text-right">
									<Button
										variant="secondary"
										size="sm"
										block
										onClick={this.addContainer.bind(this)}
									>
										Add new container to order
									</Button>
								</div>
							</div>
							<table className="table table-sm table-bordered">
								<thead className="bg-light">
									<tr>
										<th className="w-50">Name</th>
										<th className="w-25">Type</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{containers.map((container, index) => {
										return (
											<tr key={container.id}>
												<td>
													<div className="d-flex align-items-center">
														{' '}
														{container.name}
													</div>
												</td>
												<td>
													<Form.Control
														as="select"
														name="container_type[]"
														className="custom-select custom-select-sm"
														defaultValue={'placeholder'}
														onChange={this.updateContainerType.bind(
															this,
															index
														)}
														custom
													>
														<option value="placeholder" disabled>
															Select container type
														</option>
														{containerTypes.map((container) => {
															return (
																<option
																	key={container.type_size}
																	value={container.type_size}
																>
																	{container.type_size}
																</option>
															);
														})}
													</Form.Control>
												</td>
												<td>
													<div className="d-flex align-items-center justify-content-end">
														<Button
															variant="danger"
															size="sm"
															className="w-50"
															block
															onClick={this.removeContainer.bind(this, index)}
														>
															Remove
														</Button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</Form.Group>

						<Form.Group controlId="submitButton">
							<Button
								variant="primary"
								disabled={isLoading}
								block
								onClick={this.createOrder.bind(this)}
							>
								{isLoading ? 'Submiting new order...' : 'Submit'}
							</Button>
						</Form.Group>
					</Form>
				</div>
			</div>
		);
	}
}
