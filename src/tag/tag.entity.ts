import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tags' })
export class TagEntitty {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
