import dotenv from "dotenv";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolvers";
import { createConnection } from "typeorm";
import cors from "cors";

(async () => {
  dotenv.config();
  const app = express();

  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));

  app.get("/", (_req, res) => res.send("Hello world!"));

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("express server started on http://localhost:4000/graphql");
  });
})();
