import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository, LessThan } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { Hr } from './entities/hr.entity';
import { StudentStatus } from '../types/students';
import { StudentService } from '../student/student.service';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Student) private studentEntity: Repository<Student>,
    @InjectRepository(Hr) private hrEntity: Repository<Hr>,
    private readonly studentService: StudentService,
  ) {}

  async addStudentToInterviewList(hrId: string, studentId: string) {
    await this.processInterviews();

    const hrUser = await this.userEntity.findOneOrFail({
      where: { id: hrId },
      relations: ['hr'],
    });

    hrUser.hr.students;

    const student = await this.studentEntity.findOneOrFail({
      where: { id: studentId },
      relations: ['profile'],
    });

    if (
      hrUser.hr.students &&
      hrUser.hr.students.length >= hrUser.hr.maxReservedStudents
    ) {
      throw new BadRequestException(
        'Przekroczono maksymalną liczbę studentów do rozmowy.',
      );
    }

    if (student.status === StudentStatus.Available) {
      student.hr = hrUser.hr;
      student.status = StudentStatus.InInterview;
      await this.studentEntity.save(student);
      return {
        message: `Student ${student.profile.githubUsername} dodany do rozmowy kwalifikacyjnej z ${hrUser.hr.fullName}`,
      };
    } else {
      throw new BadRequestException('Student nie jest dostępny do rozmowy.');
    }
  }

  async processInterviews() {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const students = await this.studentEntity.find({
      where: { interviewAddedAt: LessThan(tenDaysAgo) },
    });

    for await (const student of students) {
      student.hr = null;
      student.status = StudentStatus.Available;
      await student.save();
    }
  }

  async removeStudentFromHr(hrId: string, studentId: string) {
    const student = await this.studentEntity.findOneOrFail({
      where: { id: studentId },
      relations: ['profile'],
    });
    student.hr = null;
    student.status = StudentStatus.Available;

    await this.studentEntity.save(student);

    return {
      message: `Student ${student.profile.githubUsername} usunięty z rozmowy kwalifikacyjnej`,
    };
  }

  async getAllStudents(hrUser: User) {
    return this.studentService.findAllToHr(hrUser);
  }
}
