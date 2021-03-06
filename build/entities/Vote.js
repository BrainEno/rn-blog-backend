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
const Comment_1 = __importDefault(require("./Comment"));
const Entity_1 = __importDefault(require("./Entity"));
const Blog_1 = __importDefault(require("./Blog"));
const User_1 = __importDefault(require("./User"));
let Vote = class Vote extends Entity_1.default {
    constructor(vote) {
        super();
        Object.assign(this, vote);
    }
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Vote.prototype, "value", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.default),
    (0, typeorm_1.ManyToOne)(() => User_1.default),
    (0, typeorm_1.JoinColumn)({ name: 'username', referencedColumnName: 'username' }),
    __metadata("design:type", User_1.default)
], Vote.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Vote.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Blog_1.default),
    (0, typeorm_1.ManyToOne)(() => Blog_1.default),
    __metadata("design:type", Blog_1.default)
], Vote.prototype, "blog", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Comment_1.default),
    __metadata("design:type", Comment_1.default)
], Vote.prototype, "comment", void 0);
Vote = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('votes'),
    __metadata("design:paramtypes", [Object])
], Vote);
exports.default = Vote;
//# sourceMappingURL=Vote.js.map