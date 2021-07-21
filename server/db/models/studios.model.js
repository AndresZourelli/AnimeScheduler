const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Studio extends Model {
    static get tableName() {
        return tableNames.studios;
    }
}

module.exports = Studio;