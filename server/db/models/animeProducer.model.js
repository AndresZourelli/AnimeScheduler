const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AnimeProducer extends Model {
    static get tableName() {
        return tableNames.anime_producer;
    }
}

module.exports = AnimeProducer;