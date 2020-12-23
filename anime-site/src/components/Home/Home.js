import React, { Component } from 'react';
import Navbar from '../NavBar/Navbar';
import ShowAnime from '../ShowAnime/ShowAnime';
import './Home.scss';

let rawData = require('../../anime.json');

export default class Home extends Component {
	render() {
		return (
			<div>
				<Navbar />
				<div className="card-grid">
					{Object.keys(rawData).map((key, index) => {
						return <ShowAnime key={index} data={rawData[key]} />;
					})}
				</div>
			</div>
		);
	}
}
