const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Season extends Model {
    static get tableName() {
        return tableNames.seasons;
    }
}

module.exports = Season;