const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AnimeStudio extends Model {
    static get tableName() {
        return tableNames.anime_studio;
    }
}

module.exports = AnimeStudio;