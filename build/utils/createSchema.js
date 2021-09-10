"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
const BlogResolvers_1 = require("../resolvers/BlogResolvers");
const CategoryResolvers_1 = require("../resolvers/CategoryResolvers");
const CommentResolvers_1 = require("../resolvers/CommentResolvers");
const TagResolvers_1 = require("../resolvers/TagResolvers");
const UserResolvers_1 = require("../resolvers/UserResolvers");
const AuthChecker_1 = require("../middleware/AuthChecker");
const type_graphql_1 = require("type-graphql");
const createSchema = () => (0, type_graphql_1.buildSchema)({
    resolvers: [
        UserResolvers_1.UserResolver,
        CategoryResolvers_1.CategoryResolver,
        TagResolvers_1.TagResolver,
        BlogResolvers_1.BlogResolver,
        CommentResolvers_1.CommentResolvers
    ],
    authChecker: AuthChecker_1.authChecker
});
exports.createSchema = createSchema;
//# sourceMappingURL=createSchema.js.map