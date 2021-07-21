const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class UserRole extends Model {
    static get tableName() {
        return tableNames.user_roles;
    }
}

module.exports = UserRole;