const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AnimeCharacter extends Model {
    static get tableName() {
        return tableNames.anime_character;
    }
}

module.exports = AnimeCharacter;