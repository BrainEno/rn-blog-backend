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
exports.CommentResolvers = void 0;
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middleware/isAuth");
const Comment_1 = __importDefault(require("../entities/Comment"));
const apollo_server_express_1 = require("apollo-server-express");
const User_1 = __importDefault(require("../entities/User"));
const Blog_1 = __importDefault(require("../entities/Blog"));
const class_validator_1 = require("class-validator");
let CommentResolvers = class CommentResolvers {
    newComment(blogIdentifier, content, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ id: payload.userId });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('认证失败');
            const blog = yield Blog_1.default.findOneOrFail({ identifier: blogIdentifier });
            if (!blog)
                throw new Error('不可评论该文章，请重试');
            if ((0, class_validator_1.isEmpty)(content))
                throw new Error('评论内容不得为空');
            try {
                const comment = new Comment_1.default({ content, blog, user });
                yield comment.save();
                return comment;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    editComment({ payload }, identifier, newContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ id: payload.userId });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('认证失败');
            const commentToEdt = yield Comment_1.default.findOneOrFail({ identifier });
            if (!commentToEdt)
                throw new Error('无法编辑该评论，请重试');
            if ((0, class_validator_1.isEmpty)(newContent))
                throw new Error('输入内容不得为空');
            commentToEdt.content = newContent;
            try {
                const editedComment = yield commentToEdt.save();
                return editedComment;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    removeComment(identifier, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ id: payload.userId });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('认证失败');
            const commentToRm = yield Comment_1.default.findOneOrFail({ identifier });
            if (!commentToRm)
                throw new Error('无法删除该评论，请重试');
            try {
                const RemovedComment = yield commentToRm.remove();
                return RemovedComment;
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
    (0, type_graphql_1.Mutation)(() => Comment_1.default),
    __param(0, (0, type_graphql_1.Arg)('blogIdentifier')),
    __param(1, (0, type_graphql_1.Arg)('content')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommentResolvers.prototype, "newComment", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => Comment_1.default),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('identifier')),
    __param(2, (0, type_graphql_1.Arg)('newContent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CommentResolvers.prototype, "editComment", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => Comment_1.default),
    __param(0, (0, type_graphql_1.Arg)('identifier')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentResolvers.prototype, "removeComment", null);
CommentResolvers = __decorate([
    (0, type_graphql_1.Resolver)()
], CommentResolvers);
exports.CommentResolvers = CommentResolvers;
//# sourceMappingURL=CommentResolvers.js.map