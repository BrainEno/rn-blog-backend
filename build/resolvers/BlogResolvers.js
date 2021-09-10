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
exports.BlogResolver = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const class_validator_1 = require("class-validator");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const Blog_1 = __importDefault(require("../entities/Blog"));
const User_1 = __importDefault(require("../entities/User"));
const isAuth_1 = require("../middleware/isAuth");
const helpers_1 = require("../utils/helpers");
let BlogResolver = class BlogResolver {
    createBlog({ payload }, title, body, desc) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ id: payload.userId });
            if (!user)
                throw new apollo_server_errors_1.AuthenticationError("认证失败，请登录");
            try {
                const createdAt = new Date();
                const blog = new Blog_1.default({ user, title, body, desc, createdAt });
                yield blog.save();
                return blog;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    pubBlog({ payload }, identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = yield User_1.default.findOneOrFail({ id: payload === null || payload === void 0 ? void 0 : payload.userId });
            if (!owner)
                throw new apollo_server_errors_1.AuthenticationError("认证失败,无法编辑此文章");
            try {
                let errors = {};
                if (class_validator_1.isEmpty(identifier))
                    errors.identifier = "请选择要更新的文章";
                let blogToPub = yield Blog_1.default.findOneOrFail({ identifier });
                if (!blogToPub)
                    throw new Error("未找到您要发布的文章，请重试");
                blogToPub.isPublished = true;
                try {
                    yield blogToPub.save();
                }
                catch (err) {
                    throw err;
                }
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    listAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield Blog_1.default.find();
                return blogs;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    getOwnBlogs({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = yield User_1.default.findOneOrFail({ id: payload === null || payload === void 0 ? void 0 : payload.userId });
            if (!owner)
                throw new apollo_server_errors_1.AuthenticationError("认证失败");
            try {
                const blogs = yield Blog_1.default.find({ where: { user: owner } });
                if (!blogs)
                    throw new Error("您还没有写过文章");
                return blogs;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    updateBlog({ payload }, identifier, newTitle, newBody, newDesc) {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = yield User_1.default.findOneOrFail({ id: payload === null || payload === void 0 ? void 0 : payload.userId });
            if (!owner)
                throw new apollo_server_errors_1.AuthenticationError("认证失败,无法编辑此文章");
            try {
                let errors = {};
                if (class_validator_1.isEmpty(identifier))
                    errors.oldName = "请选择要更新的文章";
                if (class_validator_1.isEmpty(newBody))
                    errors.newBody = "文章内容不得为空";
                if (class_validator_1.isEmpty(newTitle))
                    errors.newTitle = "文章标题不得为空";
                if (class_validator_1.isEmpty(newDesc))
                    errors.desc = "文章简介不得为空";
                let blogToUpd = yield Blog_1.default.findOneOrFail({ identifier });
                if (!blogToUpd)
                    errors.title = "未找到文章";
                blogToUpd.title = newTitle;
                blogToUpd.body = newBody;
                blogToUpd.desc = newDesc || newBody.trim().slice(0, 45);
                yield blogToUpd.save();
                return blogToUpd;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    deleteBlog({ payload }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = yield User_1.default.findOneOrFail({ id: payload === null || payload === void 0 ? void 0 : payload.userId });
            if (!owner)
                throw new apollo_server_errors_1.AuthenticationError("认证失败,没有权限删除文章");
            try {
                let errors = {};
                if (class_validator_1.isEmpty(id))
                    errors.id = "请选择要删除的文章";
                let blogToDel = yield Blog_1.default.findOneOrFail(id);
                if (!blogToDel)
                    errors.blog = "您要删除的文章不存在，请重新选择";
                if (Object.keys(errors).length > 0) {
                    throw errors;
                }
                try {
                    const deletedBlog = yield blogToDel.remove();
                    return deletedBlog;
                }
                catch (err) {
                    return err;
                }
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    uploadBlogPic({ payload }, identifier, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ id: payload.userId });
            if (!user)
                throw new apollo_server_errors_1.AuthenticationError("认证失败");
            let blog = yield Blog_1.default.findOneOrFail(identifier);
            if (!blog)
                throw new Error("未找到要上传图片的文章，请重试");
            upload.single(filename);
            blog.imageUrn = `${process.env.BASE_URL}/uploads/blogs/${filename}`;
            yield blog.save();
            return blog.imageUrn;
        });
    }
};
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Blog_1.default),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("title")),
    __param(2, type_graphql_1.Arg("body")),
    __param(3, type_graphql_1.Arg("desc")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "createBlog", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Blog_1.default),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("identifier")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "pubBlog", null);
__decorate([
    type_graphql_1.Query(() => [Blog_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "listAllBlogs", null);
__decorate([
    type_graphql_1.Authorized(),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => [Blog_1.default]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "getOwnBlogs", null);
__decorate([
    type_graphql_1.Authorized(),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Blog_1.default),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("identifier")),
    __param(2, type_graphql_1.Arg("newTitle")),
    __param(3, type_graphql_1.Arg("newBody")),
    __param(4, type_graphql_1.Arg("newDesc")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "updateBlog", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Blog_1.default),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "deleteBlog", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("identifier")),
    __param(2, type_graphql_1.Arg("filename")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "uploadBlogPic", null);
BlogResolver = __decorate([
    type_graphql_1.Resolver()
], BlogResolver);
exports.BlogResolver = BlogResolver;
const upload = multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: "uploads/blogs/",
        filename: (_, __, callback) => {
            const name = helpers_1.makeId(15);
            callback(null, name + path_1.default.extname);
        },
    }),
    fileFilter: (__, file, callback) => {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            callback(null, true);
        }
        else {
            callback(new Error("无效的图片类型"));
        }
    },
});
//# sourceMappingURL=BlogResolvers.js.map