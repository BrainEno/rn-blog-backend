import { BlogResolver } from '../resolvers/BlogResolver';
import { CategoryResolver } from '../resolvers/CategoryResolver';
import { CommentResolver } from '../resolvers/CommentResolver';
import { TagResolver } from '../resolvers/TagResolver';
import { UserResolver } from '../resolvers/UserResolver';
import { authChecker } from '../middleware/AuthChecker';
import { buildSchema } from 'type-graphql';
import { MessageResolver } from '../resolvers/MessageResolvers';
import { NotificationResolver } from '../resolvers/NotificationResolver';

export const createSchema = () =>
  buildSchema({
    resolvers: [
      UserResolver,
      CategoryResolver,
      TagResolver,
      BlogResolver,
      CommentResolver,
      MessageResolver,
      NotificationResolver
    ],
    authChecker
  });
