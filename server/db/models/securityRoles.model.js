const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class SecurityRole extends Model {
    static get tableName() {
        return tableNames.security_roles;
    }
}

module.exports = SecurityRole;