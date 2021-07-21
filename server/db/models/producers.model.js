const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Producer extends Model {
    static get tableName() {
        return tableNames.producers;
    }
}

module.exports = Producer;