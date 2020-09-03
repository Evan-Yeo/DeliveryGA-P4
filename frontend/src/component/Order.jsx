import React, { Component } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import Api from '../services/Api';

export default class Order extends Component {
	constructor(props) {
		super(props);
		const { match } = props;
		console.log(props, match);
		this.state = {
			user: props.user || null,
			order: null,
			statuses: null,
			id: match.params.id,
		};
		this.api = new Api();
	}

	mounted = false;

	componentWillMount() {
		this.mounted = true;
		this.loadOrder();
		this.loadOrderActivity();
	}
	componentWillUnmount() {
		this.mounted = false;
	}

	loadOrder() {
		if (this.mounted) {
			return this.api.fetch
				.get(`orders/find/${this.state.id}`)
				.then(({ order }) => {
					this.setState({ order });
				});
		}
	}

	loadOrderActivity() {
		if (this.mounted) {
			return this.api.fetch
				.get(`orders/activity/${this.state.id}`)
				.then(({ statuses }) => {
					this.setState({ statuses });
				});
		}
	}

	cancelOrder(order) {
		return this.api.fetch.put(`orders/cancel/${order.id}`).then(({ order }) => {
			this.setState({ order });
		});
	}

	updateActivity(order) {
		return this.api.fetch
			.put(`orders/update-activity/${order.id}`)
			.then(({ order }) => {
				this.loadOrderActivity();
				this.setState({ order });
			});
	}

	render() {
		const { order, statuses } = this.state;

		if (!order || !statuses) {
			return (
				<div className="container">
					<div className="d-flex align-items-center justify-content-center my-4">
						Loading...
					</div>
				</div>
			);
		}

		const canUpdateOrder =
			order.status === 'assigned' || order.status === 'in_progress';

		return (
			<div className="container">
				<div className="py-4 d-flex flex-column w-full">
					<div className="d-flex align-items-center justify-content-between mb-3">
						<div>
							<h4>Order {order.internal_id}</h4>
							<span className={`badge badge-${order.status}`}>
								{order.status}
							</span>
						</div>

						<div className="w-25 text-right">
							{canUpdateOrder && (
								<DropdownButton id="dropdown-basic-button" title="Actions">
									<Dropdown.Item onClick={this.cancelOrder.bind(this, order)}>
										Cancel Order
									</Dropdown.Item>
									<Dropdown.Item
										onClick={this.updateActivity.bind(this, order)}
									>
										Update Status
									</Dropdown.Item>
								</DropdownButton>
							)}
						</div>
					</div>
				</div>
				<div>
					<div className="tml timeline--horizontal">
						<div className="timeline__wrap">
							<div className="timeline__items">
								{statuses.map((status) => {
									return (
										<div key={status.id} className="timeline__item">
											<div className="timeline__content">
												<h2>{status.created_at}</h2>
												<h3>{status.status}</h3>
												<p className="status-details">{status.details}</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
				<div className="d-flex align-items-center justify-content-between mb-3">
					<div className="w-25">
						<div className="font-weight-bold">Pickup</div>
						<div className="">{order.payload.pickup.name}</div>
					</div>
					<div className="w-25">
						<div className="font-weight-bold">Dropoff</div>
						<div className="">{order.payload.dropoff.name}</div>
					</div>
					<div className="w-25">
						<div className="font-weight-bold">Driver Assigned</div>
						<div className="">{order.driver.name}</div>
					</div>
				</div>
				<table className="table table-sm table-bordered">
					<thead className="bg-light">
						<tr>
							<th>ID</th>
							<th className="w-50">Name</th>
							<th className="w-25">Type</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{order.payload.entities.map((container) => {
							return (
								<tr key={container.id}>
									<td>{container.id}</td>
									<td>{container.name}</td>
									<td>{container.type}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}
