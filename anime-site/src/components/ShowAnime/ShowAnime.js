import React from 'react';
import './ShowAnime.scss';

export default function ShowAnime({ data }) {
	return (
		<div className="card" style={{ width: '100%', height: 'auto', border: 'grey solid 1px' }}>
			<div className="m-5" style={{ maxHeight: '325px', maxWidth: 'auto' }}>
				<img
					id="image"
					src={urlParse(data.image_url)}
					className="card-img-top"
					alt={data.title}
					style={{ height: 'auto', width: 'auto' }}
				/>
			</div>
			<div className="card-body" style={{ wordWrap: 'break-word' }}>
				<h4 className="card-title">{data.title}</h4>
				<p className="card-text">
					{data.description.length > 90 ? data.description.substring(0, 90) + '...' : data.description}
				</p>
			</div>
		</div>
	);
}

let urlParse = (URL) => {
	let base = URL.split('r/');
	let args = base[1].split('/');
	let imageId = args[4].split('?');
	let newURL = base[0] + args[1] + '/' + args[2] + '/' + args[3] + '/' + imageId[0];
	return newURL;
};
