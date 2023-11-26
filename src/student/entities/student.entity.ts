import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Min, Max, IsInt } from 'class-validator';

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

}
