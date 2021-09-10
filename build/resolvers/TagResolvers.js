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
exports.TagResolver = void 0;
const isAuth_1 = require("./../middleware/isAuth");
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const Tag_1 = __importDefault(require("../entities/Tag"));
const User_1 = __importDefault(require("../entities/User"));
let TagResolver = class TagResolver {
    createTag(name, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ id: payload.userId });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('认证失败');
            try {
                const errors = {};
                if ((0, class_validator_1.isEmpty)(name))
                    errors.name = '标签名不得为空';
                const isTag = yield (0, typeorm_1.getRepository)(Tag_1.default)
                    .createQueryBuilder('tag')
                    .where('lower(tag.name)=:name', { name: name.toLowerCase() })
                    .getOne();
                if (isTag)
                    errors.name = '该类名已存在';
                if (Object.keys(errors).length > 0) {
                    throw errors;
                }
            }
            catch (err) {
                return err;
            }
            try {
                const tag = new Tag_1.default({ name });
                yield tag.save();
                return tag;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    listAllTags() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allTags = yield Tag_1.default.find();
                return allTags;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    getTagByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, class_validator_1.isEmpty)(name))
                throw new apollo_server_express_1.UserInputError('类名不得为空');
            try {
                const tag = yield Tag_1.default.findOne({ name });
                return tag;
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    deleteTag({ payload }, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOneOrFail({ id: payload.userId });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('认证失败');
            try {
                const errors = {};
                if ((0, class_validator_1.isEmpty)(name))
                    errors.name = '请输入要删除的标签名';
                const tagToDel = yield Tag_1.default.findOneOrFail(name);
                if (!tagToDel)
                    errors.name = '您要删除的标签不存在，请重新输入';
                if (Object.keys(errors).length > 0) {
                    throw errors;
                }
                try {
                    const deletedTag = yield tagToDel.remove();
                    return deletedTag;
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
};
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => Tag_1.default),
    __param(0, (0, type_graphql_1.Arg)('name')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TagResolver.prototype, "createTag", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Tag_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagResolver.prototype, "listAllTags", null);
__decorate([
    (0, type_graphql_1.Query)(() => Tag_1.default),
    __param(0, (0, type_graphql_1.Arg)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TagResolver.prototype, "getTagByName", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => Tag_1.default),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TagResolver.prototype, "deleteTag", null);
TagResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], TagResolver);
exports.TagResolver = TagResolver;
//# sourceMappingURL=TagResolvers.js.map