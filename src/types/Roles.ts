import { registerEnumType } from "type-graphql";

enum Roles {
  ADMIN = "ADMIN",
  AUTH_USER = "AUTH_USER",
  PASSAGER = "PASSAGER",
}

registerEnumType(Roles, {
  name: "Roles",
  description: "user roles",
  valuesConfig: {
    ADMIN: {
      description: "Admin users",
    },
    AUTH_USER: {
      description: "Authenticated users",
    },
    PASSAGER: {
      description: "Unauthenticated users",
    },
  },
});

export default Roles;
