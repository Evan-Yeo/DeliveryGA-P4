import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navigation({ user, logout }) {
	return (
		<Navbar bg="dark" expand="lg" variant="dark">
			<Navbar.Brand href="/">Deliverall</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Link className="nav-link" to="/">
						Home
					</Link>
					{user && (
						<Link className="nav-link" to="/">
							New Shipment
						</Link>
					)}
				</Nav>

				<Nav>
					{user ? (
						<>
							<Nav.Link href="#user">{user.username}</Nav.Link>
							<Link to="/logout" onClick={logout} className="nav-link">
								Logout
							</Link>
						</>
					) : (
						<>
							<Link to="/login" className="nav-link">
								Login
							</Link>
							<Link to="/register" className="nav-link">
								Register
							</Link>
						</>
					)}
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default Navigation;
