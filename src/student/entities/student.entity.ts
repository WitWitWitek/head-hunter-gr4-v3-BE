import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Min, Max, IsInt } from 'class-validator';
import { Profile } from './profile.entity';

enum StudentStatus {
  Available = 'Dostępny',
  InInterview = 'W trakcie rozmowy',
  Employed = 'Zatrudniony',
}

@Entity('student')
export class Student extends BaseEntity {
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
  })
  @IsInt()
  @Min(0)
  @Max(5)
  courseCompletion: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  @Min(0)
  @Max(5)
  courseEngagement: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  @Min(0)
  @Max(5)
  projectDegree: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  @Min(0)
  @Max(5)
  teamProjectDegree: number;

  @Column('simple-array', {
    nullable: true,
  })
  bonusProjectUrls: string[];

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.Available,
  })
  status: StudentStatus;

  @Column({
    default: false,
  })
  isActive: boolean;

  @OneToOne(() => Profile, (profile) => profile.student, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Profile;
}
