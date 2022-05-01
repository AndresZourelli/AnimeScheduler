import { Model } from "objection";
import { Role } from "./role";

export class PrivateUser extends Model {
  user_id?: string;
  username?: string;
  email?: string;
  active?: boolean;
  role?: string;

  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "user_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "email", "user_id"],
      properties: {
        user_id: { type: "string" },
        username: { type: "string" },
        email: { type: "string" },
        active: { type: "boolean" },
        role: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      role: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: "users.user_id",
          through: {
            from: "user_roles.user_id",
            to: "user_roles.role_id",
          },
          to: "roles.role_id",
        },
      },
    };
  }
}

export class User extends Model {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
      },
    };
  }
}
