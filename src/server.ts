import dotenv from 'dotenv';
import 'reflect-metadata';
import express from 'express';
// import morgan from "morgan";
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createSchema } from './utils/createSchema';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { upload, uploadAvatar, uploadPicture } from './uploadPicture';
import _ from './sendRefreshToken';
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

const bootstrap = async () => {
  dotenv.config();
  const PORT = process.env.PORT;
  const app = express();

  // app.use(morgan("dev") as any);
  app.use(cookieParser());
  app.use(cors({ origin: '*' }));
  app.use(express.static('./uploads'));
  app.use(graphqlUploadExpress());
  app.get('/', (_req, res) => res.send('Hello world!'));
  //上传用户头像
  app.post('/upload/avatar', upload.single('file'), uploadAvatar);
  //上传博客图片或类别图片
  app.post('/upload/blog', upload.single('file'), uploadPicture);
  app.post('/upload/category', upload.single('file'), uploadPicture);
  //refresh_token;
  app.post('/refresh_token', _.sendRefreshTokenController);

  const httpServer = createServer(app);

  try {
    await createConnection();
    console.log('Database connected!');
  } catch (err) {
    console.log(err);
  }

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    introspection: true
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app } as any);

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe
    },
    {
      server: httpServer,
      path: apolloServer.graphqlPath
    }
  );

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => subscriptionServer.close());
  });

  httpServer.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}/graphql`);
  });
};

bootstrap();
