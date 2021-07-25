require("dotenv").config();

const rootDir = process.env.NODE_ENV === "development" ? "src" : "build";

const port = parseInt(process.env.DB_PORT);

module.exports =
  process.env.NODE_ENV === "development"
    ? {
        type: "postgres",
        host: process.env.DB_HOST,
        port,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: true,
        logging: process.env.NODE_ENV === "development",
        entities: [rootDir + "/entities/**/*{.ts,.js}"],
        migrations: [rootDir + "/migrations/**/*{.ts,.js}"],
        subscribers: [rootDir + "/subscribers/**/*{.ts,.js}"],
        cli: {
          entitiesDir: rootDir + "/entities",
          migrationsDir: rootDir + "/migrations",
          subscribersDir: rootDir + "/subscribers",
        },
      }
    : {
        name: "default",
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: false,
        entities: [rootDir + "/entities/**/*{.ts,.js}"],
        migrations: [rootDir + "/migrations/**/*{.ts,.js}"],
        subscribers: [rootDir + "/subscribers/**/*{.ts,.js}"],
        seeds: [rootDir + "/seeds/**/*{.ts,.js}"],
        extra: {
          ssl: { rejectUnauthorized: false },
        },
        cli: {
          entitiesDir: rootDir + "/entities",
          migrationsDir: rootDir + "/migrations",
          subscribersDir: rootDir + "/subscriber",
        },
      };
