const formatErrors = (e) => {
  if (e.name === "ValidationError") {
    const errors = [];
    Object.keys(e.errors).forEach((key) => {
      errors.push({ type: key, message: e.errors[key].message });
    });
    return errors;
  }

  if (e.name === "MongoError") {
    const key = Object.keys(e.keyPattern)[0];
    let error;
    if (key === "username") {
      error = [{ type: key, message: "Username already taken" }];
      return error;
    }
    if (key === "email") {
      error = [{ type: key, message: "Email already registered" }];
      return error;
    }
  }
  return [{ type: "Unknown", message: "Something went wrong" }];
};

module.exports = { formatErrors };
