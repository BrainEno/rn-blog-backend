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
const Entity_1 = __importDefault(require("./Entity"));
const class_validator_1 = require("class-validator");
const helpers_1 = require("../utils/helpers");
const Comment_1 = __importDefault(require("./Comment"));
let Reply = class Reply extends Entity_1.default {
    constructor(reply) {
        super();
        Object.assign(this, reply);
    }
    makeId() {
        this.identifier = 'r-' + (0, helpers_1.makeId)(5);
    }
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)('varchar', { unique: true }),
    __metadata("design:type", String)
], Reply.prototype, "identifier", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.MaxLength)(150),
    (0, typeorm_1.Column)('text', { nullable: false }),
    __metadata("design:type", String)
], Reply.prototype, "content", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Reply.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default),
    (0, typeorm_1.JoinColumn)({ name: 'username', referencedColumnName: 'username' }),
    __metadata("design:type", User_1.default)
], Reply.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Comment_1.default),
    (0, typeorm_1.ManyToMany)(() => Comment_1.default, (comment) => comment.replies),
    __metadata("design:type", Array)
], Reply.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Reply.prototype, "makeId", null);
Reply = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('comments'),
    __metadata("design:paramtypes", [Object])
], Reply);
exports.default = Reply;
//# sourceMappingURL=Reply.js.map