import 'reflect-metadata';
import { TagEntitty } from '../tag/tag.entity';
import { UserEntity } from '../user/user.entity';
import { DataSource } from 'typeorm';
import { ArticleEntity } from '../article/article.entity';
import { FollowEntity } from '../profile/following.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'devuser',
  password: '1234',
  database: 'blog',
  schema: 'public',
  entities: [UserEntity, TagEntitty, ArticleEntity, FollowEntity],
  migrations: ['src/migrations/**/*.{ts,js}'],
});
