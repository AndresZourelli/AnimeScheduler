const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AltNameTypes extends Model {
    static get tableName() {
        return tableNames.alt_name_types;
    }

    static get relationMappings() {
        const AltAnimeNames = require("./altAnimeNames.model")
        return {
            altAnimeNames: {
                relation: Model.HasManyRelation,
                modelClass: AltAnimeNames,
                join: {
                    from: `${tableNames.alt_name_types}.alt_name_type_id`,
                    to: `${tableNames.alt_anime_names}.fk_alt_name_type_id`
                }
            }
        }
    }
}

module.exports = AltNameTypes;