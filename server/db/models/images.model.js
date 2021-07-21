const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Image extends Model {
    static get tableName() {
        return tableNames.images;
    }
}

module.exports = Image;