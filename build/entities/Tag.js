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
const helpers_1 = require("../utils/helpers");
const Blog_1 = __importDefault(require("./Blog"));
const Entity_1 = __importDefault(require("./Entity"));
let Tag = class Tag extends Entity_1.default {
    constructor(tag) {
        super();
        Object.assign(this, tag);
    }
    makeSlug() {
        this.slug = helpers_1.slugify(this.name);
    }
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [Blog_1.default]),
    typeorm_1.ManyToMany(() => Blog_1.default, (blog) => blog.id),
    __metadata("design:type", Array)
], Tag.prototype, "blogs", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Index(),
    typeorm_1.Column("text", { unique: true }),
    __metadata("design:type", String)
], Tag.prototype, "slug", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Tag.prototype, "makeSlug", null);
Tag = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity("tags"),
    __metadata("design:paramtypes", [Object])
], Tag);
exports.default = Tag;
//# sourceMappingURL=Tag.js.map