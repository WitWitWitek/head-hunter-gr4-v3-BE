import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import {Student} from "../student/entities/student.entity";
import {CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {CreateStudentDto, CreateUserStudentToAdd, UserRole} from 'src/types';


@Injectable()
export class UserService {
  private userService: UserService[] = [];

  constructor(@InjectRepository(User) private userEntity: Repository<User>,
              @InjectRepository(Student) private studentEntity: Repository<Student>,
              ) {}

  async createStudent(newStudents: CreateStudentDto[], role: UserRole):Promise<string> {

    const filteredStudents: CreateStudentDto[] = await Promise.all(
        (await Promise.all(newStudents.map(async (student: CreateStudentDto):Promise<CreateStudentDto> => {
          const email: string = student.email;
          const existingStudent: Student = await this.studentEntity.findOne({
            where: { email },
          });

          function isCourseGrade(value: number): boolean {
            return value >= 0 && value <= 5;
          }

          if (!existingStudent &&
              email.includes('@') &&
              isCourseGrade(student.courseCompletion) &&
              isCourseGrade(student.courseEngagement) &&
              isCourseGrade(student.projectDegree) &&
              isCourseGrade(student.teamProjectDegree)
              // && githubRepoUrl
          ) {
            return student;
          }
          return null;
        }))).filter((student: CreateStudentDto) => student !== null) as CreateStudentDto[]
    );
    const studentsToAdd:CreateStudentDto[] = filteredStudents.filter((student: CreateStudentDto): boolean => student !== null);
    await this.studentEntity.save(studentsToAdd);
    const userStudentsToAdd: CreateUserStudentToAdd[] = studentsToAdd.map(student => ({
      email: student.email,
      role: role,
    }));
    await this.userEntity.save(userStudentsToAdd);
    return `Added ${studentsToAdd.length} of ${newStudents.length}.`
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { password, email, username } = createUserDto;

    const hashedPassword = await hash(password, 10);

    const adminUser = new User();
    //adminUser.username = username;  // #todo do czego to potrzebne ?
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