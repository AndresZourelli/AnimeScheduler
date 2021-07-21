const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class CharacterRole extends Model {
    static get tableName() {
        return tableNames.character_roles;
    }
}

module.exports = CharacterRole;