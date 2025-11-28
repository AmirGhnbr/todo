import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'todos' })
export class TodoEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  categoryId!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate!: Date | null;

  @Column({ length: 32 })
  status!: string;

  @Column({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt!: Date | null;

  @Column({ default: false })
  isDeleted!: boolean;

  @ManyToOne(() => CategoryEntity, (category: CategoryEntity) => category.todos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category?: CategoryEntity;
}
