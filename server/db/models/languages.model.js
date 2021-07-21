const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Language extends Model {
    static get tableName() {
        return tableNames.languages;
    }
}

module.exports = Language;