import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Api from '../services/Api';

class Drivers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: props.user || null,
			drivers: null,
		};
		this.api = new Api();
	}

	mounted = false;

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

	render() {
		const { drivers } = this.state;

		if (!drivers) {
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
						<h4>Your drivers</h4>
						<div className="w-25 text-right">
							<Link className="btn btn-primary btn-sm" to="/new-driver">
								New Driver
							</Link>
						</div>
					</div>

					<div className="mb-3 w-25">
						<input
							type="text"
							className="form-control"
							placeholder="Search for drivers"
						/>
					</div>

					<table className="table table-sm table-bordered">
						<thead className="bg-light">
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Phone</th>
							</tr>
						</thead>
						<tbody>
							{drivers.map(function (driver, index) {
								return (
									<tr key={driver.id}>
										<td>{driver.id}</td>
										<td>{driver.name}</td>
										<td>{driver.phone_number}</td>
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

const DriversWithRouter = withRouter(Drivers);

export default DriversWithRouter;
