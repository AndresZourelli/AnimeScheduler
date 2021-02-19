const formatErrors = (e) => {
  if (e.name === "ValidationError") {
    const errors = [];
    Object.keys(e.errors).forEach((key) => {
      errors.push({ type: key, message: e.errors[key].message });
    });
    return errors;
  } else {
    return [{ type: "Uknown", message: "Something went wrong" }];
  }
};

module.exports = { formatErrors };
