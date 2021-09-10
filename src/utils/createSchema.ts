import { BlogResolver } from '../resolvers/BlogResolvers';
import { CategoryResolver } from '../resolvers/CategoryResolvers';
import { CommentResolvers } from '../resolvers/CommentResolvers';
import { TagResolver } from '../resolvers/TagResolvers';
import { UserResolver } from '../resolvers/UserResolvers';
import { authChecker } from '../middleware/AuthChecker';
import { buildSchema } from 'type-graphql';

export const createSchema = () =>
  buildSchema({
    resolvers: [
      UserResolver,
      CategoryResolver,
      TagResolver,
      BlogResolver,
      CommentResolvers
    ],
    authChecker
  });
