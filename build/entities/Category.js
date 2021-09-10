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
const Blog_1 = __importDefault(require("./Blog"));
const User_1 = __importDefault(require("./User"));
let Category = class Category extends Entity_1.default {
    constructor(category) {
        super();
        Object.assign(this, category);
    }
};
__decorate([
    type_graphql_1.Field({ nullable: false }),
    typeorm_1.Index(),
    typeorm_1.Column("text", { unique: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "desc", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "bannerUrn", void 0);
__decorate([
    type_graphql_1.Field({ nullable: false }),
    typeorm_1.Column("text", { name: "owner" }),
    __metadata("design:type", String)
], Category.prototype, "owner", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.default),
    typeorm_1.JoinColumn({ name: "owner", referencedColumnName: "username" }),
    __metadata("design:type", User_1.default)
], Category.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => [Blog_1.default]),
    typeorm_1.OneToMany(() => Blog_1.default, (blog) => blog.categories),
    __metadata("design:type", Array)
], Category.prototype, "blogs", void 0);
Category = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity("categories"),
    __metadata("design:paramtypes", [Object])
], Category);
exports.default = Category;
//# sourceMappingURL=Category.js.map