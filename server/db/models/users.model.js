const { Model } = require("objection");
const tableNames = require("../../utils/constants/tableNames");

class User extends Model {
  static get tableName() {
    return tableNames.users;
  }

  static get idColumn() {
    return "user_id";
  }
}

module.exports = User;
