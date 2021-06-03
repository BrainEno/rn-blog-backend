import dotenv from "dotenv";
import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolvers";
import { createConnection } from "typeorm";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import User from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshtoken } from "./sendRefreshToken";
import { CategoryResolver } from "./resolvers/CategoryResolvers";

const main = async () => {
  dotenv.config();
  const PORT = process.env.PORT;
  const app = express();

  app.use(morgan("dev") as any);
  app.use(cookieParser());
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
  app.get("/", (_req, res) => res.send("Hello world!"));

  //刷新token;
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

    // 如果token有效, 发送一个访问许可;
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

  try {
    await createConnection();
    console.log("Database connected!");
  } catch (err) {
    console.log(err);
  }

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, CategoryResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
    introspection: true,
    playground: true,
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}/graphql`);
  });
};

main();
