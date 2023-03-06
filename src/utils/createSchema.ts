import { BlogResolver } from '../resolvers/BlogResolver';
import { CategoryResolver } from '../resolvers/CategoryResolver';
import { CommentResolver } from '../resolvers/CommentResolver';
import { TagResolver } from '../resolvers/TagResolver';
import { UserResolver } from '../resolvers/UserResolver';
import { buildSchema } from 'type-graphql';
import { MessageResolver } from '../resolvers/MessageResolvers';
import { NotificationResolver } from '../resolvers/NotificationResolver';
import { LikeResolver } from '../resolvers/likeResolver';
import { AuthResolver } from '../resolvers/AuthResolvers';
import path from 'path';

export const createSchema = () =>
  buildSchema({
    resolvers: [
      AuthResolver,
      UserResolver,
      CategoryResolver,
      TagResolver,
      BlogResolver,
      CommentResolver,
      LikeResolver,
      MessageResolver,
      NotificationResolver
    ],
     emitSchemaFile: {
            path: path.resolve(__dirname, '../schemas/schema.gql'),
            commentDescriptions: true,
            sortedSchema: false,
        },
  });
