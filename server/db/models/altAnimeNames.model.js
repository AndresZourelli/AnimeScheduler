const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AltAnimeNames extends Model {
    static get tableName() {
        return tableNames.alt_anime_names;
    }

    static get relationMappings() {
        const AltAnimeNameType = require("./altNameTypes.model");
        const Anime = require("./animes.model");
        return {
            altAnimeNameTypes: {
                relation: Model.BelongsToOneRelation,
                modelClass: AltAnimeNameType,
                join: {
                    from: `${tableNames.alt_anime_names}.fk_alt_name_type_id`,
                    to: `${tableNames.alt_name_types}.alt_name_type_id`
                }
            },
            animes: {
                relation: Model.HasOneRelation,
                modelClass: Anime,
                join: {
                    from: `${tableNames.alt_anime_names}.fk_anime_id`,
                    to: `${tableNames.animes}.anime_id`
                }
            }
        }
    }
}

module.exports = AltAnimeNames;