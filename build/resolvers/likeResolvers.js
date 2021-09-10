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
exports.LikeResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const Blog_1 = __importDefault(require("../entities/Blog"));
const Like_1 = __importDefault(require("../entities/Like"));
const User_1 = __importDefault(require("../entities/User"));
const isAuth_1 = require("../middleware/isAuth");
let LikeResolver = class LikeResolver {
    ToggleLike({ payload }, isLiked, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ id: payload.userId });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('认证失败');
            try {
                let newLike;
                const like = yield Like_1.default.findOne({ username: user.username });
                if (like && like.isLiked !== 0)
                    like.isLiked = 0;
                if (!like) {
                    const blog = yield Blog_1.default.findOneOrFail({ id: blogId });
                    if (!blog)
                        throw new Error('无法收藏该文章，请重试');
                    newLike = new Like_1.default({
                        isLiked,
                        user,
                        blog
                    });
                    yield newLike.save();
                    return newLike;
                }
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => Like_1.default),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('isLiked')),
    __param(2, (0, type_graphql_1.Arg)('blogId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], LikeResolver.prototype, "ToggleLike", null);
LikeResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], LikeResolver);
exports.LikeResolver = LikeResolver;
//# sourceMappingURL=likeResolvers.js.map