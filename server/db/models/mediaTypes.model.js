const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class MediaType extends Model {
    static get tableName() {
        return tableNames.media_types;
    }
}

module.exports = MediaType;