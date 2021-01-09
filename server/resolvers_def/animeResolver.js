const { pool } = require('../database/database');

const resolverAnime = {
	Query: {
		animes: async (_, args) => {
			const { rows } = await pool.query(
				'select * from animes as a left join "types" t on a.fk_type=t.type_id left join seasons s on s.season_id=a.fk_season left join sources s2 on s2.source_id=a.fk_source left join statuses s3 on s3.status_id=a.fk_status left join ratings r on r.rating_id=a.fk_rating limit 5'
			);

			let complete_data = rows.map(async (row) => {
				let anime_id = row.anime_id;

				let genres = await pool.query(
					'select distinct genre_name, t.genre_id from (select * from genres_animes ga where fk_anime_id=$1) as t join genres g2 on t.fk_genre_id=g2.genre_id',
					[ anime_id ]
				);
				row.genres = genres.rows;

				let producers = await pool.query(
					'select distinct producer_name, producer_id from (select * from producers_animes pa where fk_anime_id=$1) as t join producers p2 on t.fk_producer_id=p2.producer_id',
					[ anime_id ]
				);
				row.producers = producers.rows;

				let licensors = await pool.query(
					'select distinct licensor_name, licensor_id from (select * from licensors_animes la where fk_anime_id=$1) as t join licensors l2 on t.fk_licensor_id=l2.licensor_id',
					[ anime_id ]
				);
				row.licensors = licensors.rows;

				let studios = await pool.query(
					'select distinct studio_name, studio_id from (select * from studios_animes sa where fk_anime_id=$1) as t join studios s2 on t.fk_studios_id=s2.studio_id',
					[ anime_id ]
				);
				row.studios = studios.rows;

				let alt_names = await pool.query(
					'select alt_name, alt_name_id from alt_names an where fk_anime_id=$1',
					[ anime_id ]
				);
				row.alt_names = alt_names.rows;

				return row;
			});
			let result = await Promise.all(complete_data);
			return result;
		},
		anime: async (_, args) => {
			const {
				rows
			} = await pool.query(
				'select * from (select * from animes where anime_id=$1) as a left join "types" t on a.fk_type=t.type_id left join seasons s on s.season_id=a.fk_season left join sources s2 on s2.source_id=a.fk_source left join statuses s3 on s3.status_id=a.fk_status left join ratings r on r.rating_id=a.fk_rating',
				[ args.id ]
			);

			let complete_data = rows.map(async (row) => {
				let anime_id = row.anime_id;

				let genres = await pool.query(
					'select distinct genre_name, t.genre_id from (select * from genres_animes ga where fk_anime_id=$1) as t join genres g2 on t.fk_genre_id=g2.genre_id',
					[ anime_id ]
				);
				row.genres = genres.rows;

				let producers = await pool.query(
					'select distinct producer_name, producer_id from (select * from producers_animes pa where fk_anime_id=$1) as t join producers p2 on t.fk_producer_id=p2.producer_id',
					[ anime_id ]
				);
				row.producers = producers.rows;

				let licensors = await pool.query(
					'select distinct licensor_name, licensor_id from (select * from licensors_animes la where fk_anime_id=$1) as t join licensors l2 on t.fk_licensor_id=l2.licensor_id',
					[ anime_id ]
				);
				row.licensors = licensors.rows;

				let studios = await pool.query(
					'select distinct studio_name, studio_id from (select * from studios_animes sa where fk_anime_id=$1) as t join studios s2 on t.fk_studios_id=s2.studio_id',
					[ anime_id ]
				);
				row.studios = studios.rows;

				let alt_names = await pool.query(
					'select alt_name, alt_name_id from alt_names an where fk_anime_id=$1',
					[ anime_id ]
				);
				row.alt_names = alt_names.rows;

				return row;
			});

			let result = await Promise.all(complete_data);
			return result[0] || [];
		}
	}
};

module.exports = { resolverAnime };
