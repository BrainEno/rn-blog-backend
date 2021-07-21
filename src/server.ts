import dotenv from "dotenv";
import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createSchema } from "./utils/createSchema";
import { upload, uploadAvatar, uploadPicture } from "./uploadPicture";
import _ from "./sendRefreshToken";

const bootstrap = async () => {
  dotenv.config();
  const PORT = process.env.PORT;
  const app = express();

  app.use(morgan("dev") as any);
  app.use(cookieParser());
  app.use(cors({ origin: "*" }));
  app.use(express.static("./uploads"));
  app.get("/", (_req, res) => res.send("Hello world!"));
  //上传用户头像
  app.post("/upload/avatar", upload.single("file"), uploadAvatar);
  //上传博客图片或类别图片
  app.post("/upload/blog", upload.single("file"), uploadPicture);
  app.post("/upload/category", upload.single("file"), uploadPicture);
  //刷新token;
  app.post("/refresh_token", _.sendRefreshTokenController);

  try {
    await createConnection();
    console.log("Database connected!");
  } catch (err) {
    console.log(err);
  }

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    introspection: true,
    playground: true,
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}/graphql`);
  });
};

bootstrap();
