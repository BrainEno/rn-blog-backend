import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const rootDir = process.env.NODE_ENV === 'development' ? 'src' : 'build';

const port = parseInt(process.env.DB_PORT!, 10);
const options: DataSourceOptions =
  process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL
    ? {
        name: 'default',
        type: 'postgres',
        host: process.env.DB_HOST,
        port,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: true,
        logging: process.env.NODE_ENV === 'development',
        entities: [rootDir + '/entities/**/*{.ts,.js}'],
        migrations: [rootDir + '/migrations/**/*{.ts,.js}'],
        subscribers: [rootDir + '/subscribers/**/*{.ts,.js}'],
        ssl: false
      }
    : {
        name: 'default',
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: false,
        logging: false,
        entities: [rootDir + '/entities/**/*{.ts,.js}'],
        migrations: [rootDir + '/migrations/**/*{.ts,.js}'],
        subscribers: [rootDir + '/subscribers/**/*{.ts,.js}'],
        extra: {
          ssl: { rejectUnauthorized: false }
        }
      };

export const AppDataSource: DataSource = new DataSource(options);
