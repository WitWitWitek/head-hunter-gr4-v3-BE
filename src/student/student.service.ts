import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Profile } from './entities/profile.entity';
import { UpdatetudentProfileDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentEntity: Repository<Student>,
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Profile) private profileEntity: Repository<Profile>,
  ) {}

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  async updateProfile(
    studentId: string,
    updateProfileDto: UpdatetudentProfileDto,
  ) {
    const student: Student = await this.studentEntity.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new Error(`Nie mamy w bazie studenta o id: ${studentId}.`);
    }

    const profile = new Profile();
    profile.student = student;

    console.log(Object.keys(updateProfileDto));

    await this.studentEntity.update({ id: student.id }, { isActive: true });
    return updateProfileDto;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
