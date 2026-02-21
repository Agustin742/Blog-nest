import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  slug!: string;

  @Column()
  description!: string;

  @Column()
  body!: string;

  @Column()
  title!: string;

  @Column('simple-array')
  tagList!: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Column({ default: 0 })
  favoritesCount!: number;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
