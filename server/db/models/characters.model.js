const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Character extends Model {
    static get tableName() {
        return tableNames.characters;
    }
}

module.exports = Character;