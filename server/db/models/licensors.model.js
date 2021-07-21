const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Licensor extends Model {
    static get tableName() {
        return tableNames.licensors;
    }
}

module.exports = Licensor;