import dotenv from "dotenv";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolvers";
import { createConnection } from "typeorm";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshtoken } from "./sendRefreshToken";

(async () => {
  dotenv.config();
  const app = express();
  app.use(cookieParser());
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));

  app.get("/", (_req, res) => res.send("Hello world!"));

  //刷新token
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.bot;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    //如果token有效,
    //发送一个访问许可
    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshtoken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

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
