"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
var Roles;
(function (Roles) {
    Roles["ADMIN"] = "ADMIN";
    Roles["AUTH_USER"] = "AUTH";
    Roles["NORMAL_USER"] = "PASSAGER";
})(Roles || (Roles = {}));
type_graphql_1.registerEnumType(Roles, {
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
exports.default = Roles;
//# sourceMappingURL=Roles.js.map