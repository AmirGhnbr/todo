import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TodoEntity } from './todo.entity';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ default: false })
  isDeleted!: boolean;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => TodoEntity, (todo: TodoEntity) => todo.category)
  todos?: TodoEntity[];
}
