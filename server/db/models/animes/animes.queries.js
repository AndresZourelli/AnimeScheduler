const db = require("../../dbConfig");
const tableNames = require("../../../utils/constants/tableNames");
const Animes = require("./animes.model");

const getAltNames = async (id) => {
  const values = await Animes.relatedQuery("altAnimeNames")
    .select("*")
    .for(id)
    .join(
      "alternate_anime_names",
      `${tableNames.animes}.id`,
      "=",
      `${tableNames.alternate_anime_names}.anime_id`
    )
    .select("*");
  return values;
};

const getCharacters = async (id) => {
  const returnValue = await db(`${tableNames.characters}`)
    .select("*")
    .join(
      tableNames.anime_character,
      `${tableNames.characters}.id`,
      `${tableNames.anime_character}.character_id`
    )
    .join(
      tableNames.animes,
      `${tableNames.anime_character}.anime_id`,
      `${tableNames.animes}.id`
    )
    .join(
      tableNames.character_roles,
      `${tableNames.anime_character}.character_role_id`,
      `${tableNames.character_roles}.id`
    )
    .join(
      tableNames.images,
      `${tableNames.characters}.character_image_id`,
      `${tableNames.images}.id`
    )
    .where(`${tableNames.animes}.anime_id`, "=", id);
  return returnValue;
};

const getActors = async (id) => {
  const returnValue = await db(`${tableNames.anime_actor}`)
    .select("*")
    .join(
      tableNames.persons,
      `${tableNames.anime_character}.person_id`,
      `${tableNames.persons}.id`
    )
    .join(
      tableNames.animes,
      `${tableNames.anime_character}.anime_id`,
      `${tableNames.animes}.id`
    )
    .join(
      tableNames.languages,
      `${tableNames.anime_character}.language_id`,
      `${tableNames.languages}.id`
    )
    .join(
      tableNames.images,
      `${tableNames.persons}.person_image_id`,
      `${tableNames.images}.id`
    )
    .where(`${tableNames.anime_character}.anime_id`, "=", id);
  return returnValue;
};

const getGenres = async (id) => {
  const returnValue = await db(`${tableNames.anime_genre}`)
    .select("*")
    .join(
      tableNames.genres,
      `${tableNames.anime_genre}.genre_id`,
      `${tableNames.genres}.id`
    )
    .where(`${tableNames.anime_genre}.anime_id`, "=", id);
  return returnValue;
};

const getAnime = async (id) => {
  const returnValue = await db(tableNames.animes)
    .select("*")
    .join(
      tableNames.airing_status_types,
      `${tableNames.animes}.airing_status_id`,
      `${tableNames.airing_status_types}.id`
    )
    .join(
      tableNames.media_types,
      `${tableNames.animes}.media_type_id`,
      `${tableNames.media_types}.id`
    )
    .join(
      tableNames.seasons,
      `${tableNames.animes}.season_id`,
      `${tableNames.seasons}.id`
    )
    .join(
      `${tableNames.images}`,
      `${tableNames.animes}.profile_image_id`,
      `${tableNames.images}.id`
    )
    .join(
      tableNames.source_material_types,
      `${tableNames.animes}.source_material_id`,
      `${tableNames.source_material_types}.id`
    )
    .where(`${tableNames.animes}.anime_id`, "=", id);

  return returnValue;
};

const searchAnimes = async (searchText) => {
  const searchResult = await db(tableNames.animes)
    .select("*")
    .join(
      tableNames.alternate_anime_names,
      `${tableNames.animes}.id`,
      `${tableNames.alternate_anime_names}.anime_id`
    )
    .join(
      `${tableNames.images}`,
      `${tableNames.animes}.profile_image_id`,
      `${tableNames.images}.id`
    )
    .where(`${tableNames.animes}.title`, "ilike", `${searchText}%`)
    .orWhere(
      `${tableNames.alternate_anime_names}.name`,
      "ilike",
      `${searchText}%`
    )
    .distinctOn(`${tableNames.animes}.id`);
  return searchResult;
};

const getHighestRatedAnimes = async (limit = 30, page = 0) => {
  const returnValue = await Animes.query()
    .select("*")
    .join(
      `${tableNames.images}`,
      `${tableNames.animes}.profile_image_id`,
      `${tableNames.images}.id`
    )
    .orderBy(`${tableNames.animes}.average_watcher_rating`, "desc")
    .page(page, limit);
  return returnValue.results;
};

const getCurrentSeasons = async (season, page = 0, limit = 30) => {
  const returnValue = await Animes.query()
    .select("*")
    .join(
      tableNames.seasons,
      `${tableNames.animes}.season_id`,
      `${tableNames.seasons}.id`
    )
    .join(
      `${tableNames.airing_status_types}`,
      `${tableNames.animes}.airing_status_id`,
      `${tableNames.airing_status_types}.id`
    )
    .join(
      `${tableNames.images}`,
      `${tableNames.animes}.profile_image_id`,
      `${tableNames.images}.id`
    )
    .where(`${tableNames.seasons}.season`, "=", season)
    .andWhere(
      `${tableNames.airing_status_types}.airing_status_type`,
      "=",
      "Currently Airing"
    )
    .page(page, limit)
    .orderBy(`${tableNames.animes}.average_watcher_rating`, "DESC");
  return returnValue.results;
};

const getContinuedSeasons = async (season, page = 0, limit = 30) => {
  const returnValue = await Animes.query()
    .select(
      `${tableNames.animes}.id`,
      `${tableNames.animes}.title`,
      `${tableNames.animes}.average_watcher_rating`,
      `${tableNames.images}.url`
    )
    .join(
      tableNames.seasons,
      `${tableNames.animes}.season_id`,
      `${tableNames.seasons}.id`
    )
    .join(
      `${tableNames.airing_status_types}`,
      `${tableNames.animes}.airing_status_id`,
      `${tableNames.airing_status_types}.id`
    )
    .join(
      `${tableNames.images}`,
      `${tableNames.animes}.profile_image_id`,
      `${tableNames.images}.id`
    )
    .where(
      `${tableNames.airing_status_types}.airing_status_type`,
      "=",
      "Currently Airing"
    )
    .whereNot(`${tableNames.seasons}.season`, "=", season)
    .page(page, limit)
    .orderBy(`${tableNames.animes}.average_watcher_rating`, "DESC");
  return returnValue.results;
};

const getAnimePaths = async () => {
  const returnValue = await Animes.query().select(`${tableNames.animes}.id`);
  return returnValue;
};

const getAnimeStaff = async (animeId) => {
  const returnValue = await db(tableNames.anime_staff)
    .select("*")
    .join(
      `${tableNames.persons}`,
      `${tableNames.anime_staff}.person_id`,
      `${tableNames.persons}.id`
    )
    .join(
      `${tableNames.staff_roles}`,
      `${tableNames.anime_staff}.staff_role_id`,
      `${tableNames.staff_roles}.id`
    )
    .join(
      `${tableNames.images}`,
      `${tableNames.persons}.person_image_id`,
      `${tableNames.images}.id`
    )
    .where(`${tableNames.anime_staff}.anime_id`, "=", animeId);

  const modifiedData = returnValue.map((data) => ({
    first_name: data.first_name,
    last_name: data.last_name,
    native_name: data.native_name,
    alternate_names: data.alternate_names,
    description: data.description,
    profile_image_url: data.url,
  }));

  return modifiedData;
};

module.exports = {
  getAltNames,
  getCharacters,
  getActors,
  getGenres,
  searchAnimes,
  getHighestRatedAnimes,
  getAnime,
  getCurrentSeasons,
  getContinuedSeasons,
  getAnimePaths,
  getAnimeStaff,
};
