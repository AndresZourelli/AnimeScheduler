const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Rating extends Model {
    static get tableName() {
        return tableNames.ratings;
    }
}

module.exports = Rating;