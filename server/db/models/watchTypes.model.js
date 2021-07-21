const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class WatchType extends Model {
    static get tableName() {
        return tableNames.watch_types;
    }
}

module.exports = WatchType;