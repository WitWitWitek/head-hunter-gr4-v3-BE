import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { Student } from '../student/entities/student.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStudentDto, CreateUserStudentToAdd, UserRole } from 'src/types';
import { In } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Student) private studentEntity: Repository<Student>,
  ) {}

  async createStudent(
    newStudents: CreateStudentDto,
    role: UserRole,
  ): Promise<string> {
    const { students } = newStudents;
    const emails = students.map((student) => student.email);
    const existingStudents = await this.studentEntity.find({
      where: {
        email: In(emails),
      },
    });
    const existingStudentsEmails = existingStudents.map(
      (existingStudent) => existingStudent.email,
    );
    const studentsToAdd = students.filter(
      (newStudent) => !existingStudentsEmails.includes(newStudent.email),
    );

    await this.studentEntity.save(studentsToAdd);
    const userStudentsToAdd: CreateUserStudentToAdd[] = studentsToAdd.map(
      (student) => ({
        email: student.email,
        role: role,
      }),
    );
    await this.userEntity.save(userStudentsToAdd);
    return `Added ${studentsToAdd.length} of ${students.length}.`;
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    const hashedPassword = await hash(password, 10);

    const adminUser = new User();
    adminUser.password = hashedPassword;
    adminUser.email = email;
    adminUser.role = UserRole.Admin;
    adminUser.confirmed = true;

    await this.userEntity.save(adminUser);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
