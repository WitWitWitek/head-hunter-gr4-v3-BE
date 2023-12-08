import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IsInt, Max, Min } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

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

  @OneToOne(() => User, (user) => user.hr, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
