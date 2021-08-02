const { Model } = require("objection");
const tableNames = require("../../../utils/constants/tableNames");

class Anime extends Model {
  static get tableName() {
    return tableNames.animes;
  }

  static get relationMappings() {
    const AltAnimeNames = require("../altAnimeNames.model");
    return {
      altAnimeNames: {
        relation: Model.HasManyRelation,
        modelClass: AltAnimeNames,
        join: {
          from: `${tableNames.animes}.anime_id`,
          to: `${tableNames.alt_anime_names}.fk_anime_id`,
        },
      },
    };
  }
}
module.exports = Anime;
