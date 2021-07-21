const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AnimeGenre extends Model {
    static get tableName() {
        return tableNames.anime_genre;
    }
}

module.exports = AnimeGenre;