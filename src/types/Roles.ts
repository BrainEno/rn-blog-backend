import { registerEnumType } from "type-graphql";

enum Roles {
  ADMIN = "ADMIN",
  AUTH_USER = "AUTH",
  NORMAL_USER = "PASSAGER",
}

registerEnumType(Roles, {
  name: "Roles",
  description: "user roles",
  valuesConfig: {
    ADMIN: {
      description: "admin users",
    },
    AUTH_USER: {
      description: "authed users",
    },
    NORMAL_USER: {
      description: "passager users",
    },
  },
});

export default Roles;
