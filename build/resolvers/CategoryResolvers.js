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
exports.CategoryResolver = void 0;
const isAuth_1 = require("./../middleware/isAuth");
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("../entities/User"));
const Category_1 = __importDefault(require("../entities/Category"));
const apollo_server_express_1 = require("apollo-server-express");
const fs_1 = require("fs");
const graphql_upload_1 = require("graphql-upload");
let CategoryResolver = class CategoryResolver {
    createCategory(name, { payload }, desc) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ id: payload.userId });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError("认证失败");
            try {
                let errors = {};
                if (class_validator_1.isEmpty(name))
                    errors.name = "类名不得为空";
                const isCategory = yield typeorm_1.getRepository(Category_1.default)
                    .createQueryBuilder("category")
                    .where("lower(category.name)=:name", { name: name.toLowerCase() })
                    .getOne();
                if (isCategory)
                    errors.name = "该类名已存在";
                if (Object.keys(errors).length > 0) {
                    throw errors;
                }
            }
            catch (err) {
                return err;
            }
            try {
                const category = new Category_1.default({ user, name, desc });
                yield category.save();
                return category;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    listAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield Category_1.default.find();
                return categories;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    getCategoryByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (class_validator_1.isEmpty(name))
                throw new apollo_server_express_1.UserInputError("类名不得为空");
            try {
                const category = yield Category_1.default.findOne({ name });
                return category;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    getOWnCategories({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = yield User_1.default.findOneOrFail({ id: payload.userId });
            if (!owner)
                throw new apollo_server_express_1.AuthenticationError("认证失败");
            try {
                const categories = yield Category_1.default.find({ where: { owner } });
                if (categories)
                    return categories;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    updateCategory({ payload }, oldName, newName, desc) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOneOrFail({ id: payload.userId });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError("认证失败");
            try {
                let errors = {};
                if (class_validator_1.isEmpty(oldName))
                    errors.oldName = "请输入要替换的类名";
                if (class_validator_1.isEmpty(newName))
                    errors.newName = "类名不得为空";
                if (class_validator_1.isEmpty(desc))
                    errors.desc = "要输入的描述不得为空";
                if (Object.keys(errors).length > 0)
                    throw errors;
                let catToUpd = yield Category_1.default.findOneOrFail({ name: oldName });
                if (!catToUpd)
                    errors.name = "您要更新的类名不存在，请直接创建";
                if (Object.keys(errors).length > 0)
                    throw errors;
                catToUpd.name = newName;
                catToUpd.desc = desc;
                try {
                    yield catToUpd.save();
                }
                catch (err) {
                    console.log(err);
                    throw err;
                }
                return catToUpd;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    uploadCatBanner({ payload }, cateName, { createReadStream, filename }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ id: payload.userId });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError("认证失败");
            const stream = createReadStream();
            yield stream.pipe(fs_1.createWriteStream(__dirname, `/../../../uploads/categories/${filename}`));
            let category = yield Category_1.default.findOneOrFail({ name: cateName });
            if (!category)
                throw new Error("未找到要上传封面的话题，请重试");
            category.bannerUrn = `${process.env.BASE_URL}/uploads/categories/${filename}`;
            yield category.save();
            return {
                url: `${process.env.BABEL_ENV}/uploads/categories/${filename}`,
            };
        });
    }
};
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Category_1.default),
    __param(0, type_graphql_1.Arg("name")),
    __param(1, type_graphql_1.Ctx()),
    __param(2, type_graphql_1.Arg("desc")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
__decorate([
    type_graphql_1.Query(() => [Category_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "listAllCategories", null);
__decorate([
    type_graphql_1.Query(() => Category_1.default),
    __param(0, type_graphql_1.Arg("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "getCategoryByName", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => [Category_1.default]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "getOWnCategories", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Category_1.default),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("oldName")),
    __param(2, type_graphql_1.Arg("newName")),
    __param(3, type_graphql_1.Arg("desc")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "updateCategory", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("catName")),
    __param(2, type_graphql_1.Arg("file", () => graphql_upload_1.GraphQLUpload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "uploadCatBanner", null);
CategoryResolver = __decorate([
    type_graphql_1.Resolver()
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
//# sourceMappingURL=CategoryResolvers.js.map