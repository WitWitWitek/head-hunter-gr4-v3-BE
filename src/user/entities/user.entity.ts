import { Hr } from 'src/hr/entities/hr.entity';
import { Student } from 'src/student/entities/student.entity';
import { UserRole } from 'src/types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToOne(() => Student, (student) => student.user, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @OneToOne(() => Hr, (hr) => hr.user, {
    onDelete: 'CASCADE',
  })
  hr: Hr;
}
