import { UserRole } from 'src/types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,  // false
    length: 50,
    unique: false,   // true
  })
  username: string;

  @Column({
    nullable: false,
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
    length: 100,
  })
  password: string;

  @Column({
    default: false,
  })
  confirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({
    nullable: true,
    default: null,
  })
  loginToken: string;
}
