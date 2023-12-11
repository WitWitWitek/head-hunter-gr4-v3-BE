import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateHrDto } from './dto/update-hr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
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

  async addStudentToInterviewList(
    hrId: string,
    studentId: string,
  ): Promise<void> {
    await this.processInterviews();

    const hr = await this.hrEntity.findOneOrFail({
      where: { id: hrId },
    });
    const student = await this.studentEntity.findOneOrFail({
      where: { id: studentId, isActive: true },
    });

    if (hr.students.length >= hr.maxReservedStudents) {
      throw new BadRequestException(
        'Przekroczono maksymalną liczbę studentów do rozmowy.',
      );
    }

    if (student.status === StudentStatus.Available) {
      student.hr = hr;
      student.status = StudentStatus.InInterview;
      await this.studentEntity.save(student);
    } else {
      throw new BadRequestException('Student nie jest dostępny do rozmowy.');
    }
  }

  async processInterviews(): Promise<void> {
    // const allHrs = await this.hrEntity.find();
    // for (const hr of allHrs) {
    // const studentsToInterviews = hr.students;
    // for (const studentId of studentsToInterviews) {
    //   const student = await this.studentEntity.findOneOrFail({
    //     where: { id: studentId },
    //   });
    //   // Sprawdź, czy minęło 10 dni od dodania studenta do listy "Do rozmowy"
    //   const tenDaysAgo = new Date();
    //   tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    //   if (
    //     student.status === StudentStatus.InInterview &&
    //     student.interviewAddedAt < tenDaysAgo
    //   ) {
    //     // Automatyczna zmiana statusu studenta na "Dostępny"
    //     student.status = StudentStatus.Available;
    //     hr.studentsToInterviews = hr.studentsToInterviews.filter(
    //       (id) => id !== studentId,
    //     );
    //     await this.studentEntity.save(student);
    //     await this.hrEntity.save(hr);
    //   }
    // }
    // }
  }

  // async removeStudentFromHr(idHr: string, idStudenta: string): Promise<void> {
  //   const hr = await this.hrEntity.findOneOrFail({ where: { id: idHr } });

  //   const indeksStudent = hr.students.indexOf(idStudenta);
  //   if (indeksStudent === -1) {
  //     throw new Error('Student nie znajduje się na liście tego HR.');
  //   }

  //   const student = await this.studentEntity.findOneOrFail({
  //     where: { id: idStudenta },
  //   });

  //   student.status = StudentStatus.Available;
  //   hr.students.splice(indeksStudent, 1);

  //   await this.studentEntity.save(student);
  //   await this.hrEntity.save(hr);
  // }

  async getAllStudents(currentPage: number) {
    return this.studentService.findAllToHr(currentPage);
  }

  findOne(id: number) {
    return `This action returns a #${id} hr`;
  }

  update(id: number, updateHrDto: UpdateHrDto) {
    return `This action updates a #${id} hr`;
  }

  remove(id: number) {
    return `This action removes a #${id} hr`;
  }
}
