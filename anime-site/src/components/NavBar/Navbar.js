import React from 'react';

export default function Navbar() {
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<a href="#" className="navbar-brand">
				My Anime Site
			</a>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarNav"
				aria-controls="navbarNav"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon" />
			</button>
			<div className="collapse navbar-collapse w-100 d-flex " id="navbarNav">
				<ul className="navbar-nav w-100">
					<li className="nav-item">
						<a className="nav-link active" href="#">
							Anime
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							Current Season
						</a>
					</li>
					<li className="nav-item ml-auto">
						<a className="nav-link" href="#">
							Account
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}
