import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ default: false })
  isDeleted!: boolean;

  @OneToMany(() => CategoryEntity, (category: CategoryEntity) => category.user)
  categories?: CategoryEntity[];
}
