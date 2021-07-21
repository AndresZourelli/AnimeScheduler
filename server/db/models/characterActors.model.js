const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class CharacterActor extends Model {
    static get tableName() {
        return tableNames.character_actors;
    }
}

module.exports = CharacterActor;