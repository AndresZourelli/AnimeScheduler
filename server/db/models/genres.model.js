const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Genre extends Model {
    static get tableName() {
        return tableNames.genres;
    }
}

module.exports = Genre;