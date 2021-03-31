require("reflect-metadata");
require("dotenv").config();

const rootDir = process.env.NODE_ENV === "development" ? "src" : "build";

const port = 5432;

module.exports = {
  type: "postgres",
  host: process.env.DB_HOST,
  port,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [rootDir + "/entity/**/*{.ts,.js}"],
  migrations: [rootDir + "/migrations/**/*{.ts,.js}"],
  subscribers: [rootDir + "/subscribers/**/*{.ts,.js}"],
  cli: {
    entitiesDir: rootDir + "/entity",
    migrationsDir: rootDir + "/migrations",
    subscribersDir: rootDir + "/subscribers",
  },
};
