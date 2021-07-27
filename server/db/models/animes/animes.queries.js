const db = require("../../dbConfig");
const tableNames = require("../../../utils/constants/tableNames");
const Animes = require("./animes.model");

const getAltNames = async (id) => {
  const values = await Animes.relatedQuery("altAnimeNames")
    .for(id)
    .join("alt_name_types", "fk_alt_name_type_id", "=", "alt_name_type_id")
    .select("*");
  return values;
};

const getCharacters = async (id) => {
  const returnValue = await db(`${tableNames.characters}`)
    .select("*")
    .join(
      tableNames.anime_character,
      `${tableNames.characters}.character_id`,
      `${tableNames.anime_character}.fk_character_id`
    )
    .join(
      tableNames.animes,
      `${tableNames.anime_character}.fk_anime_id`,
      `${tableNames.animes}.anime_id`
    )
    .join(
      tableNames.character_roles,
      `${tableNames.anime_character}.fk_character_role_id`,
      `${tableNames.character_roles}.character_role_id`
    )
    .join(
      tableNames.images,
      `${tableNames.characters}.fk_character_primary_image`,
      `${tableNames.images}.image_id`
    )
    .where(`${tableNames.animes}.anime_id`, "=", id);
  return returnValue;
};

const getActors = async (id) => {
  const returnValue = await db(`${tableNames.anime_actor}`)
    .select("*")
    .join(
      tableNames.actors,
      `${tableNames.anime_actor}.fk_actor_id`,
      `${tableNames.actors}.actor_id`
    )
    .join(
      tableNames.animes,
      `${tableNames.anime_actor}.fk_anime_id`,
      `${tableNames.animes}.anime_id`
    )
    .join(
      tableNames.languages,
      `${tableNames.anime_actor}.fk_language_id`,
      `${tableNames.languages}.language_id`
    )
    .join(
      tableNames.images,
      `${tableNames.actors}.fk_actor_primary_image`,
      `${tableNames.images}.image_id`
    )
    .where(`${tableNames.anime_actor}.fk_anime_id`, "=", id);
  return returnValue;
};

const getGenres = async (id) => {
  const returnValue = await db(`${tableNames.anime_genre}`)
    .select("*")
    .join(
      tableNames.genres,
      `${tableNames.anime_genre}.fk_genre_id`,
      `${tableNames.genres}.genre_id`
    )
    .where(`${tableNames.anime_genre}.fk_anime_id`, "=", id);
  return returnValue;
};

const getAnime = async (id) => {
  const returnValue = await db(tableNames.animes)
    .select("*")
    .join(
      tableNames.airing_status_types,
      `${tableNames.animes}.fk_airing_status_type_id`,
      `${tableNames.airing_status_types}.airing_status_type_id`
    )
    .join(
      tableNames.media_types,
      `${tableNames.animes}.fk_media_type_id`,
      `${tableNames.media_types}.media_type_id`
    )
    .join(
      tableNames.seasons,
      `${tableNames.animes}.fk_season_id`,
      `${tableNames.seasons}.season_id`
    )
    .join(
      tableNames.source_material_types,
      `${tableNames.animes}.fk_source_material_id`,
      `${tableNames.source_material_types}.source_material_type_id`
    )
    .where(`${tableNames.animes}.anime_id`, "=", id);
  console.log("test", returnValue);
  return returnValue;
};

const searchAnimes = async (searchText) => {
  const searchResult = await db(tableNames.animes)
    .join(
      tableNames.alt_anime_names,
      `${tableNames.animes}.anime_id`,
      `${tableNames.alt_anime_names}.fk_anime_id`
    )
    .join(
      tableNames.alt_name_types,
      `${tableNames.alt_anime_names}.fk_alt_name_type_id`,
      `${tableNames.alt_name_types}.alt_name_type_id`
    )
    .where("anime_title", "ilike", `${searchText}%`)
    .orWhere("alt_name", "ilike", `${searchText}%`)
    .distinctOn(`${tableNames.animes}.anime_id`);
  return searchResult;
};

const getHighestRatedAnimes = async (limit = 30, page = 0) => {
  const returnValue = await Animes.query()
    .orderBy(`${tableNames.animes}.average_rating`, "desc")
    .page(page, limit);
  return returnValue;
};

const getCurrentSeasons = async (season, page = 0, limit = 30) => {
  const returnValue = await Animes.query()
    .join(
      tableNames.seasons,
      `${tableNames.animes}.fk_season_id`,
      `${tableNames.seasons}.season_id`
    )
    .join(
      `${tableNames.airing_status_types}`,
      `${tableNames.animes}.fk_airing_status_type_id`,
      `${tableNames.airing_status_types}.airing_status_type_id`
    )
    .where(`${tableNames.seasons}.season_name`, "=", season)
    .andWhere(
      `${tableNames.airing_status_types}.airing_status_type_name`,
      "=",
      "Currently Airing"
    )
    .page(page, limit)
    .orderBy(`${tableNames.animes}.average_rating`, "DESC");
  return returnValue;
};

const getContinuedSeasons = async (season, page = 0, limit = 30) => {
  const returnValue = await Animes.query()
    .join(
      tableNames.seasons,
      `${tableNames.animes}.fk_season_id`,
      `${tableNames.seasons}.season_id`
    )
    .join(
      `${tableNames.airing_status_types}`,
      `${tableNames.animes}.fk_airing_status_type_id`,
      `${tableNames.airing_status_types}.airing_status_type_id`
    )
    .where(
      `${tableNames.airing_status_types}.airing_status_type_name`,
      "=",
      "Currently Airing"
    )
    .whereNot(`${tableNames.seasons}.season_name`, "=", season)
    .page(page, limit)
    .orderBy(`${tableNames.animes}.average_rating`, "DESC");
  return returnValue;
};

const getAnimePaths = async () => {
  const returnValue = await Animes.query().select("anime_id");
  return returnValue;
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
};
