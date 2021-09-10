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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Entity_1 = __importDefault(require("./Entity"));
const User_1 = __importDefault(require("./User"));
const Comment_1 = __importDefault(require("./Comment"));
const Vote_1 = __importDefault(require("./Vote"));
const class_transformer_1 = require("class-transformer");
const helpers_1 = require("../utils/helpers");
const Tag_1 = __importDefault(require("./Tag"));
const Like_1 = __importDefault(require("./Like"));
const Category_1 = __importDefault(require("./Category"));
let Blog = class Blog extends Entity_1.default {
    constructor(blog) {
        super();
        Object.assign(this, blog);
    }
    setUserVote(user) {
        var _a;
        const index = (_a = this.votes) === null || _a === void 0 ? void 0 : _a.findIndex((v) => v.username === user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }
    setUserLike(user) {
        var _a;
        const index = (_a = this.likes) === null || _a === void 0 ? void 0 : _a.findIndex((l) => l.username === user.username);
        this.userLike = index > -1 ? this.likes[index].isLiked : 0;
    }
    get commentCount() {
        var _a;
        return (_a = this.comments) === null || _a === void 0 ? void 0 : _a.length;
    }
    get voteScore() {
        var _a;
        return (_a = this.votes) === null || _a === void 0 ? void 0 : _a.reduce((prev, curr) => prev + (curr.value || 0), 0);
    }
    get likesCount() {
        var _a;
        return (_a = this.likes) === null || _a === void 0 ? void 0 : _a.reduce((prev, curr) => prev + (curr.isLiked || 0), 0);
    }
    makeSlug() {
        this.slug = (0, helpers_1.slugify)(this.title);
    }
    makeId() {
        this.identifier = (0, helpers_1.makeId)(6);
    }
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)('varchar', { unique: true }),
    __metadata("design:type", String)
], Blog.prototype, "identifier", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)('varchar', { unique: true }),
    __metadata("design:type", String)
], Blog.prototype, "slug", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)('text', { nullable: false }),
    __metadata("design:type", String)
], Blog.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Blog.prototype, "desc", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)('text', { nullable: false }),
    __metadata("design:type", String)
], Blog.prototype, "body", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Blog.prototype, "imageUrn", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Tag_1.default]),
    (0, typeorm_1.ManyToMany)(() => Tag_1.default, (tag) => tag.blogs),
    __metadata("design:type", Array)
], Blog.prototype, "tags", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Category_1.default]),
    (0, typeorm_1.ManyToMany)(() => Category_1.default, (category) => category.blogs),
    __metadata("design:type", Array)
], Blog.prototype, "categories", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Blog.prototype, "author", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Blog.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.blogs),
    (0, typeorm_1.JoinColumn)({ name: 'author', referencedColumnName: 'username' }),
    __metadata("design:type", User_1.default)
], Blog.prototype, "user", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.OneToMany)(() => Comment_1.default, (comment) => comment.blog),
    __metadata("design:type", Array)
], Blog.prototype, "comments", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.OneToMany)(() => Vote_1.default, (vote) => vote.blog),
    __metadata("design:type", Array)
], Blog.prototype, "votes", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.OneToMany)(() => Like_1.default, (like) => like.blog),
    __metadata("design:type", Array)
], Blog.prototype, "likes", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Blog.prototype, "userVote", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Blog.prototype, "userLike", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: 0 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Blog.prototype, "commentCount", null);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: 0 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Blog.prototype, "voteScore", null);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: 0 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Blog.prototype, "likesCount", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Blog.prototype, "makeSlug", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Blog.prototype, "makeId", null);
Blog = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('blogs'),
    __metadata("design:paramtypes", [Object])
], Blog);
exports.default = Blog;
//# sourceMappingURL=Blog.js.map