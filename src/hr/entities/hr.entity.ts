import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsInt, Max, Min } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Student } from 'src/student/entities/student.entity';

@Entity('hr')
export class Hr extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 100,
  })
  fullName: string;

  @Column({
    nullable: false,
    length: 100,
  })
  company: string;

  @Column({
    nullable: false,
  })
  @IsInt()
  @Min(1)
  @Max(999)
  maxReservedStudents: number;

  @OneToMany(() => Student, (student) => student.hr)
  students: Student[];

  @OneToOne(() => User, (user) => user.hr, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
