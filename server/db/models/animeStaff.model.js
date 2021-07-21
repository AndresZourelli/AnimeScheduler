const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AnimeStaff extends Model {
    static get tableName() {
        return tableNames.anime_staff;
    }
}

module.exports = AnimeStaff;