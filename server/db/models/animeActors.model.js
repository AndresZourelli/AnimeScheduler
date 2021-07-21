const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AnimeActor extends Model {
    static get tableName() {
        return tableNames.anime_actor;
    }
}

module.exports = AnimeActor;