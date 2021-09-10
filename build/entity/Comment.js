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
const User_1 = __importDefault(require("./User"));
const Blog_1 = __importDefault(require("./Blog"));
const Entity_1 = __importDefault(require("./Entity"));
const class_validator_1 = require("class-validator");
const helpers_1 = require("../utils/helpers");
const Reply_1 = __importDefault(require("./Reply"));
let Comment = class Comment extends Entity_1.default {
    constructor(comment) {
        super();
        Object.assign(this, comment);
    }
    makeId() {
        this.identifier = "c-" + helpers_1.makeId(5);
    }
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Index(),
    typeorm_1.Column("varchar", { unique: true }),
    __metadata("design:type", String)
], Comment.prototype, "identifier", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MaxLength(150),
    typeorm_1.Column("text", { nullable: false }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], Comment.prototype, "username", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.default),
    typeorm_1.JoinColumn({ name: "username", referencedColumnName: "username" }),
    __metadata("design:type", User_1.default)
], Comment.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => Reply_1.default),
    typeorm_1.ManyToMany(() => Reply_1.default, (reply) => reply.comments),
    __metadata("design:type", Array)
], Comment.prototype, "replies", void 0);
__decorate([
    type_graphql_1.Field(() => Blog_1.default),
    typeorm_1.ManyToOne(() => Blog_1.default, (blog) => blog.comments),
    __metadata("design:type", Blog_1.default)
], Comment.prototype, "blog", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Comment.prototype, "makeId", null);
Comment = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity("comments"),
    __metadata("design:paramtypes", [Object])
], Comment);
exports.default = Comment;
//# sourceMappingURL=Comment.js.map