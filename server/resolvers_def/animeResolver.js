const { pool } = require('../database/database');

const resolverAnime = {
	Query: {
		getAnimes: async (_, args) => {
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
					'select distinct studio_name, studio_id from (select * from studios_animes sa where fk_anime_id=$1) as t join studios s2 on t.fk_studio_id=s2.studio_id',
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
		getAnime: async (_, args) => {
			const {
				rows
			} = await pool.query(
				'select * from (select * from animes where anime_id=$1) as a left join "types" t on a.fk_type=t.type_id left join seasons s on s.season_id=a.fk_season left join sources s2 on s2.source_id=a.fk_source left join statuses s3 on s3.status_id=a.fk_status left join ratings r on r.rating_id=a.fk_rating',
				[ args.anime_id ]
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
					'select distinct studio_name, studio_id from (select * from studios_animes sa where fk_anime_id=$1) as t join studios s2 on t.fk_studio_id=s2.studio_id',
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
	},

	Mutation: {
		createAnime: async (_, args) => {
			const raw_data = args.input;
			const client = await pool.connect();
			try {
				await client.query('BEGIN');

				// add anime info
				const {
					rows
				} = await client.query(
					'insert into animes (title, score, description, image_url, episodes, aired_start, aired_end, broadcast_day, broadcast_time, duration, fk_type, fk_season, fk_source, fk_status, fk_rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning *',
					[
						raw_data.title,
						raw_data.score,
						raw_data.description,
						raw_data.image_url,
						raw_data.episodes,
						raw_data.aired_start,
						raw_data.aired_end,
						raw_data.broadcast_day,
						raw_data.broadcast_time,
						raw_data.duration,
						raw_data.fk_type,
						raw_data.fk_season,
						raw_data.fk_source,
						raw_data.fk_status,
						raw_data.fk_rating
					]
				);
				const result = rows[0];

				// add genre
				if (raw_data.genres) {
					raw_data.genres.forEach((genre) => {
						const {
							rows: genre_rows
						} = client.query(
							'insert into genres_animes (fk_anime_id, fk_genre_id) values ($1, $2) returning *',
							[ result.anime_id, genre.fk_genre_id ]
						);
					});
				}

				// add names
				if (raw_data.names) {
					raw_data.names.forEach((other_name) => {
						const {
							rows: name_rows
						} = client.query('insert into alt_names (fk_anime_id, alt_name) values ($1, $2) returning *', [
							result.anime_id,
							other_name.alt_name
						]);
					});
				}

				// add producers
				if (raw_data.producers) {
					raw_data.producers.forEach((producer) => {
						const {
							rows: producer_rows
						} = client.query(
							'insert into producers_animes (fk_anime_id, fk_producer_id) values ($1, $2) returning *',
							[ result.anime_id, producer.fk_producer_id ]
						);
					});
				}

				// add licensors
				if (raw_data.licensors) {
					raw_data.licensors.forEach((licensor) => {
						const {
							rows: licensor_rows
						} = client.query(
							'insert into licensors_animes (fk_anime_id, fk_licensor_id) values ($1, $2) returning *',
							[ result.anime_id, licensor.fk_licensor_id ]
						);
					});
				}

				// add studios
				if (raw_data.studios) {
					raw_data.studios.forEach((studio) => {
						const {
							rows: studio_rows
						} = client.query(
							'insert into studios_animes (fk_anime_id, fk_studio_id) values ($1, $2) returning *',
							[ result.anime_id, studio.fk_studio_id ]
						);
					});
				}

				// success
				await client.query('COMMIT');
				await client.release();
				return {
					success: true,
					message: `Anime with id ${result.anime_id} successfully created`,
					anime_id: result.anime_id
				};
			} catch (error) {
				await client.query('ROLLBACK');
				await client.release();
				return {
					success: false,
					message: error,
					anime_id: null
				};
			}
		},
		editAnime: async (_, args) => {
			const client = await pool.connect();
			try {
				await client.query('BEGIN');
				const anime_id = args.input.anime_id;
				const { rows: original_data } = await client.query('select * from animes where anime_id=$1', [
					anime_id
				]);
				if (!original_data[0]) {
					return {
						success: false,
						message: `Anime with id ${anime_id} not found`,
						anime_id: anime_id
					};
				}

				let query_string = [ 'Update animes set' ];
				let query_values = [];
				let set = [];
				const filters = [ 'names', 'genres', 'licensors', 'producers', 'studios' ];

				let raw_data = args.input.data;

				const filtered_data = Object.keys(raw_data)
					.filter((key) => !filters.includes(key))
					.reduce((obj, key) => {
						obj[key] = raw_data[key];
						return obj;
					}, {});

				let value = 1;
				Object.keys(filtered_data).forEach((key, i) => {
					if (key) {
						value += 1;
						set.push(`${key}=$${i + 1}`);
						query_values.push(raw_data[key]);
					}
				});
				query_string.push(set.join(', '));
				query_string.push(`where anime_id=$${value} returning *`);
				query_values.push(anime_id);

				query_string = query_string.join(' ');

				const { rows: result } = await client.query(query_string, query_values);
				if (!result[0]) {
					return {
						success: false,
						message: `Anime with id ${args.input.anime_id} not found`,
						anime_id: args.input.anime_id
					};
				}

				// check for changes in genres
				if (raw_data.genres) {
					const genres_delete = await Promise.all(
						raw_data.genres.filter((genre) => !genre.checked).map(async (obj) => {
							const {
								rowCount: delete_genre_sql
							} = await client.query(
								'delete from genres_animes where fk_genre_id=$1 and fk_anime_id=$2',
								[ obj.fk_genre_id, anime_id ]
							);
						})
					);

					const genres_keep = await Promise.all(
						raw_data.genres.filter((genre) => genre.checked).map(async (obj) => {
							const {
								rows: insert_new_genres_animes
							} = await client.query(
								'insert into genres_animes (fk_anime_id, fk_genre_id) values ($1, $2) on conflict do nothing returning *',
								[ anime_id, obj.fk_genre_id ]
							);
							return insert_new_genres_animes;
						})
					);
				}

				// check for changes in licensors
				if (raw_data.licensors) {
					const licensors_delete = await Promise.all(
						raw_data.licensors.filter((licensor) => !licensor.checked).map(async (obj) => {
							const {
								rowCount: delete_licensor_sql
							} = await client.query(
								'delete from licensors_animes where fk_licensor_id=$1 and fk_anime_id=$2',
								[ obj.fk_licensor_id, anime_id ]
							);
						})
					);

					const licensors_keep = await Promise.all(
						raw_data.licensors.filter((licensor) => licensor.checked).map(async (obj) => {
							const {
								rows: insert_new_licensor_animes
							} = await client.query(
								'insert into licensors_animes (fk_anime_id, fk_licensor_id) values ($1, $2) on conflict do nothing returning *',
								[ anime_id, obj.fk_licensor_id ]
							);
						})
					);
				}

				// check for changes in producers
				if (raw_data.producers) {
					const producers_delete = await Promise.all(
						raw_data.producers.filter((producer) => !producer.checked).map(async (obj) => {
							const {
								rowCount: delete_producer_sql
							} = await client.query(
								'delete from producers_animes where fk_producer_id=$1 and fk_anime_id=$2',
								[ obj.fk_producer_id, anime_id ]
							);
						})
					);

					const producers_keep = await Promise.all(
						raw_data.producers.filter((producer) => producer.checked).map(async (obj) => {
							const {
								rows: insert_new_producer_animes
							} = await client.query(
								'insert into producers_animes (fk_anime_id, fk_producer_id) values ($1, $2) on conflict do nothing returning *',
								[ anime_id, obj.fk_producer_id ]
							);
						})
					);
				}

				// check for changes in studios
				if (raw_data.studios) {
					const studios_delete = await Promise.all(
						raw_data.studios.filter((studio) => !studio.checked).map(async (obj) => {
							const {
								rowCount: delete_studio_sql
							} = await client.query(
								'delete from studios_animes where fk_studio_id=$1 and fk_anime_id=$2',
								[ obj.fk_studio_id, anime_id ]
							);
						})
					);

					const studios_keep = await Promise.all(
						raw_data.studios.filter((studio) => studio.checked).map(async (obj) => {
							const {
								rows: insert_new_studio_animes
							} = await client.query(
								'insert into studios_animes (fk_anime_id, fk_studio_id) values ($1, $2) on conflict do nothing returning *',
								[ anime_id, obj.fk_studio_id ]
							);
						})
					);
				}

				// check for changes in names
				if (raw_data.names) {
					const { rows: start } = await client.query('select * from alt_names where fk_anime_id=$1', [
						anime_id
					]);
					console.log('start', start);

					const names_delete = await Promise.all(
						raw_data.names.filter((name) => !name.checked).map(async (obj) => {
							const {
								rowCount: delete_name_sql
							} = await client.query('delete from alt_names where alt_name=$1 and fk_anime_id=$2', [
								obj.alt_name,
								anime_id
							]);
						})
					);

					const names_keep = await Promise.all(
						raw_data.names.filter((name) => name.checked).map(async (obj) => {
							const {
								rows: insert_new_name_animes
							} = await client.query(
								'insert into alt_names (fk_anime_id, alt_name) values ($1, $2) on conflict do nothing returning *',
								[ anime_id, obj.alt_name ]
							);
						})
					);
					const { rows: end } = await client.query('select * from alt_names where fk_anime_id=$1', [
						anime_id
					]);
					console.log('end', end);
				}

				// success
				// await client.query('COMMIT');
				await client.query('ROLLBACK');
				client.release();
				return {
					success: true,
					message: `Anime with id ${args.input.anime_id} successfully updated`,
					anime_id: args.input.anime_id
				};
			} catch (err) {
				await client.query('ROLLBACK');
				client.release();
				return {
					success: false,
					message: err,
					anime_id: args.input.anime_id
				};
			}
		},
		deleteAnime: async (_, args) => {
			try {
				const { rows } = await pool.query('delete from animes where anime_id=$1', [ args.anime_id ]);
				if (!rows[0]) {
					return {
						success: false,
						message: `Anime with id ${args.anime_id} not found`,
						anime_id: args.anime_id
					};
				}
				return {
					success: true,
					message: `Anime with id ${args.anime_id} successfully deleted`,
					anime_id: args.anime_id
				};
			} catch (err) {
				return {
					success: false,
					message: err,
					anime_id: args.anime_id
				};
			}
		}
	}
};

module.exports = { resolverAnime };
