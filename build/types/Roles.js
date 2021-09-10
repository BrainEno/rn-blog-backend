"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
var Roles;
(function (Roles) {
    Roles["ADMIN"] = "ADMIN";
    Roles["AUTH_USER"] = "AUTH_USER";
    Roles["PASSAGER"] = "PASSAGER";
})(Roles || (Roles = {}));
(0, type_graphql_1.registerEnumType)(Roles, {
    name: 'Roles',
    description: 'user roles',
    valuesConfig: {
        ADMIN: {
            description: 'Admin users'
        },
        AUTH_USER: {
            description: 'Authenticated users'
        },
        PASSAGER: {
            description: 'Unauthenticated users'
        }
    }
});
exports.default = Roles;
//# sourceMappingURL=Roles.js.map