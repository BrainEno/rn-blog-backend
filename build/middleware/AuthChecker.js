"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authChecker = void 0;
const authChecker = ({ context: { payload } }, roles) => {
    var _a;
    if (roles.length === 0) {
        return payload !== undefined;
    }
    if (!payload) {
        return false;
    }
    if ((_a = payload.userRoles) === null || _a === void 0 ? void 0 : _a.some((role) => roles.includes(role))) {
        return true;
    }
    return false;
};
exports.authChecker = authChecker;
//# sourceMappingURL=AuthChecker.js.map