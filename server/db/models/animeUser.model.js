const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AnimeUser extends Model {
    static get tableName() {
        return tableNames.anime_user;
    }
}

module.exports = AnimeUser;