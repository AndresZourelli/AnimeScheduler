import { Model } from "objection";

export class Role extends Model {
  static get tableName() {
    return "roles";
  }

  static get idColumn() {
    return "role_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["role_name"],
      properties: {
        role_id: { type: "string" },
        role_name: { type: "string" },
      },
    };
  }
}
