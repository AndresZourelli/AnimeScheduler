const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class StaffRole extends Model {
    static get tableName() {
        return tableNames.staff_roles;
    }
}

module.exports = StaffRole;