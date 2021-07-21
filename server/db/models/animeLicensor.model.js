const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AnimeLicensor extends Model {
    static get tableName() {
        return tableNames.anime_licensor;
    }
}

module.exports = AnimeLicensor;