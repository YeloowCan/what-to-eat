import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity';

// 加载环境变量
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'what_to_eat',
  entities: [User],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false, // 迁移时禁用 synchronize
  logging: process.env.NODE_ENV === 'development',
});

