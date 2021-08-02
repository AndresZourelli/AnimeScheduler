const { v4: uuidv4 } = require("uuid");
const User = require("../db/models/users.model");

const invalidateTokens = async (userId) => {
  await User.query().findById(userId).patch({ refresh_token_key: uuidv4() });
};

module.exports = { invalidateTokens };
