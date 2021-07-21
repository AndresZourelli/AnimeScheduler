const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Staff extends Model {
    static get tableName() {
        return tableNames.staff;
    }
}

module.exports = Staff;