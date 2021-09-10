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
const Entity_1 = __importDefault(require("./Entity"));
const User_1 = __importDefault(require("./User"));
let Message = class Message extends Entity_1.default {
    constructor(message) {
        super();
        Object.assign(this, message);
    }
    makeId() {
        this.identifier = 'm-' + (0, helpers_1.makeId)(5);
    }
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Message.prototype, "identifier", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.default),
    (0, typeorm_1.ManyToOne)(() => User_1.default),
    (0, typeorm_1.JoinColumn)({ name: 'msgTo', referencedColumnName: 'username' }),
    __metadata("design:type", User_1.default)
], Message.prototype, "to", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.default),
    (0, typeorm_1.ManyToOne)(() => User_1.default),
    (0, typeorm_1.JoinColumn)({ name: 'msgFrom', referencedColumnName: 'username' }),
    __metadata("design:type", User_1.default)
], Message.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Message.prototype, "msgTo", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Message.prototype, "msgFrom", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Message.prototype, "makeId", null);
Message = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('messages'),
    __metadata("design:paramtypes", [Object])
], Message);
exports.default = Message;
//# sourceMappingURL=Mesage.js.map