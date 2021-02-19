class ValidationError extends Error {
  constructor(type, message) {
    super(type, message);
    this.name = "ValidationError";
    this.message = message;
    this.type = type;
    this.errors = {};
    this.errors[type] = { message };
  }
}

module.exports = ValidationError;
