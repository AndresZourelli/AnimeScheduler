const { Model } = require("objection");
const tableNames = require("../../utils/constants/tableNames");
const Animes = require("./animes.model");

class AiringStatusTypes extends Model {
  static get tableName() {
    return tableNames.airing_status_types;
  }

  static get relationMappings() {
    return {
      animeStatusTypes: {
        relation: Model.HasOneRelation,
        modelClass: Animes,
        join: {
          from: `${tableNames.airing_status_types}.airing_status_type_id`,
          to: `${tableNames.animes}.fk_airing_status_type_id`,
        },
      },
    };
  }
}

module.exports = AiringStatusTypes;
