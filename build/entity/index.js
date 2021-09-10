"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entities = void 0;
const Blog_1 = __importDefault(require("./Blog"));
const Category_1 = __importDefault(require("./Category"));
const Like_1 = __importDefault(require("./Like"));
const User_1 = __importDefault(require("./User"));
const Vote_1 = __importDefault(require("./Vote"));
const Comment_1 = __importDefault(require("./Comment"));
exports.Entities = [User_1.default, Blog_1.default, Category_1.default, Comment_1.default, Vote_1.default, Like_1.default];
//# sourceMappingURL=index.js.map