import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Api from '../services/Api';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: props.user || null,
			orders: null,
		};
		this.api = new Api();
	}

	mounted = false;

	componentWillMount() {
		this.mounted = true;
		this.loadOrders();
	}
	componentWillUnmount() {
		this.mounted = false;
	}

	loadOrders() {
		if (this.mounted) {
			return this.api.fetch.get('orders/list').then(({ orders }) => {
				this.setState({ orders });
			});
		}
	}

	cancelOrder(order, index) {
		return this.api.fetch.put(`orders/cancel/${order.id}`).then(({ order }) => {
			// update orders in memory
			const { orders } = this.state;
			// update the order
			orders[index] = order;
			// update state
			this.setState({ orders });
		});
	}

	render() {
		const { orders } = this.state;
		if (!orders) {
			return (
				<div className="container">
					<div className="d-flex align-items-center justify-content-center my-4">
						Loading...
					</div>
				</div>
			);
		}
		return (
			<div className="container">
				<div className="py-4 d-flex flex-column w-full">
					<div className="d-flex align-items-center justify-content-between mb-3">
						<h4>Your orders</h4>
						<div className="w-25 text-right">
							<Link className="btn btn-primary btn-sm" to="/new-order">
								New Order
							</Link>
						</div>
					</div>

					<div className="mb-3 w-25">
						<input
							type="text"
							className="form-control"
							placeholder="Search for orders"
						/>
					</div>

					<table className="table table-sm table-bordered">
						<thead className="bg-light">
							<tr>
								<th>ID</th>
								<th>Pickup</th>
								<th>Dropoff</th>
								<th>Driver</th>
								<th>Last Activity</th>
								<th>Status</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order, index) => {
								return (
									<tr key={order.id}>
										<td>
											<Link to={`/order/${order.id}`}>{order.internal_id}</Link>
										</td>
										<td>
											<div className="truncate w-90">
												{order.payload.pickup.name || 'N/A'}
											</div>
										</td>
										<td>
											<div className="truncate w-90">
												{order.payload.dropoff.name || 'N/A'}
											</div>
										</td>
										<td>
											<div className="truncate w-90">
												{order.driver.name || 'N/A'}
											</div>
										</td>
										<td>
											<div className="truncate w-90">
												{order.tracking_number.status_details || 'N/A'}
											</div>
										</td>
										<td>
											<span className={`badge badge-${order.status}`}>
												{order.status}
											</span>
										</td>
										<td>
											<div className="d-flex align-items-center justify-content-end">
												<Link
													className="btn btn-link text-primaty btn-block btn-sm"
													to={`/order/${order.id}`}
												>
													View
												</Link>
												{!['canceled', 'completed'].includes(order.status) && (
													<Button
														variant="link"
														size="sm"
														className="text-danger m-0"
														block
														onClick={this.cancelOrder.bind(this, order, index)}
													>
														Cancel
													</Button>
												)}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
