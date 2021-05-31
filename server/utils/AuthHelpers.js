const { v4: uuidv4 } = require("uuid");
const User = require("../mongoDB/models/user");

const invalidateTokens = async (userId) => {
  const user = await User.find(userId);
  user.refreshVerify = uuidv4();
  await user.save();
};

module.exports = { invalidateTokens };
