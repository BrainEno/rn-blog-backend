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
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const Blog_1 = __importDefault(require("./Blog"));
const Entity_1 = __importDefault(require("./Entity"));
const Vote_1 = __importDefault(require("./Vote"));
const Like_1 = __importDefault(require("./Like"));
const Comment_1 = __importDefault(require("./Comment"));
const Reply_1 = __importDefault(require("./Reply"));
const Roles_1 = __importDefault(require("../types/Roles"));
let User = class User extends Entity_1.default {
    constructor(user) {
        super();
        Object.assign(this, user);
    }
    getLikedBlogNum() {
        this.likedBlogNum = this.likes.length;
    }
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Index(),
    class_validator_1.MinLength(1, { message: "用户名不能为空" }),
    typeorm_1.Column("text", { unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Index(),
    class_validator_1.IsEmail(undefined, { message: "请填写有效的邮箱地址" }),
    class_validator_1.Length(1, 255, { message: "邮箱地址不能为空" }),
    typeorm_1.Column("text", { unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column("text"),
    class_validator_1.MinLength(6, { message: "密码不能小于6个字符" }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: false, default: Roles_1.default.NORMAL_USER }),
    type_graphql_1.Field(() => [Roles_1.default]),
    __metadata("design:type", String)
], User.prototype, "roles", void 0);
__decorate([
    typeorm_1.Column("varchar", {
        default: "https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png",
    }),
    type_graphql_1.Field({
        defaultValue: "https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png",
    }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    type_graphql_1.Field(() => [Blog_1.default]),
    typeorm_1.OneToMany(() => Blog_1.default, (blog) => blog.author),
    __metadata("design:type", Array)
], User.prototype, "blogs", void 0);
__decorate([
    type_graphql_1.Field(() => [Vote_1.default]),
    typeorm_1.OneToMany(() => Vote_1.default, (vote) => vote.user),
    __metadata("design:type", Array)
], User.prototype, "votes", void 0);
__decorate([
    type_graphql_1.Field(() => [Like_1.default]),
    typeorm_1.OneToMany(() => Like_1.default, (like) => like.user),
    typeorm_1.JoinColumn({
        name: "likedBlogs",
        referencedColumnName: "id",
    }),
    __metadata("design:type", Array)
], User.prototype, "likes", void 0);
__decorate([
    type_graphql_1.Field(() => [Comment_1.default]),
    typeorm_1.OneToMany(() => Comment_1.default, (comment) => comment.user),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    type_graphql_1.Field(() => [Reply_1.default]),
    typeorm_1.OneToMany(() => Reply_1.default, (reply) => reply.user),
    __metadata("design:type", Array)
], User.prototype, "replies", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "likedBlogNum", void 0);
__decorate([
    typeorm_1.Column("int", { default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "tokenVersion", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "getLikedBlogNum", null);
User = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity("users"),
    __metadata("design:paramtypes", [Object])
], User);
exports.default = User;
//# sourceMappingURL=User.js.map