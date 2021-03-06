"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bcryptjs_1 = require("bcryptjs");
const User_1 = __importDefault(require("../entities/User"));
const isAuth_1 = require("../middleware/isAuth");
const auth_1 = require("../auth");
const sendRefreshToken_1 = __importDefault(require("../sendRefreshToken"));
const typeorm_1 = require("typeorm");
let LoginResponse = class LoginResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
LoginResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], LoginResponse);
let UserResolver = class UserResolver {
    hello() {
        return 'Welcome!';
    }
    users() {
        return User_1.default.find();
    }
    register(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, 12);
            try {
                yield User_1.default.insert({
                    username,
                    email,
                    password: hashedPassword
                });
            }
            catch (err) {
                console.log(err);
                return false;
            }
            return true;
        });
    }
    revokeRefreshTokensForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, typeorm_1.getConnection)()
                .getRepository(User_1.default)
                .increment({ id: userId }, 'tokenVersion', 1);
            return true;
        });
    }
    login(email, password, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ where: { email } });
            if (!user) {
                throw new Error('?????????????????????,????????????');
            }
            const valid = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!valid) {
                throw new Error('??????????????????????????????');
            }
            sendRefreshToken_1.default.sendRefreshtoken(res, (0, auth_1.createRefreshToken)(user));
            return {
                accessToken: (0, auth_1.createAccessToken)(user)
            };
        });
    }
    currentUser({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield User_1.default.findOne({ id: payload.userId });
            if (!currentUser) {
                return '????????????';
            }
            else {
                return currentUser;
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('username')),
    __param(1, (0, type_graphql_1.Arg)('email')),
    __param(2, (0, type_graphql_1.Arg)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('userId', () => Number)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "revokeRefreshTokensForUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => LoginResponse),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.default),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "currentUser", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolvers.js.map