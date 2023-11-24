import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {IsIn} from "class-validator";
import { v4 as uuidv4 } from 'uuid';

enum UserRole {
  Kursant = 'kursant',
  HR = 'hr',
  Admin = 'admin',
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 50,
    unique: true,
  })
  username: string;

  @Column({
    nullable: false,
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    length: 100,
    default: "",
  })
  password: string;

  @Column({
    default: false,
  })
  confirmed: boolean;

  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsIn(Object.values(UserRole))
  role: UserRole;

  @Column({
    nullable: true,
    unique: true,
    default: null,
  })
  loginToken: string;

}
