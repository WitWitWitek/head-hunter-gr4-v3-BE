import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { UserRole } from 'src/types';
import {Student} from "../student/entities/student.entity";
import {CreateStudentDto} from "./dto/create-student.dto";


@Injectable()
export class UserService {
  private userService: UserService[] = [];

  constructor(@InjectRepository(User) private userEntity: Repository<User>,
              @InjectRepository(Student) private studentEntity: Repository<Student>) {
  }


  async createStudent(newStudents: CreateStudentDto[], role: UserRole) {

      const filteredStudents: CreateStudentDto[] = await Promise.all(newStudents.map(async (student: CreateStudentDto): Promise<CreateStudentDto> => {
      const email: string = student.email;
      const existingStudent:Student = await this.studentEntity.findOne({
        where: { email }
      });

      if (!existingStudent) {
        // Nowy, dopisujemy do bazy
        // await this.studentEntity.save(student);
        return student;
      }
      return null;
    }));

    const studentsToAdd:CreateStudentDto[] = filteredStudents.filter((student: CreateStudentDto): boolean => student !== null);
    await this.studentEntity.save(studentsToAdd);
    const userStudentsToAdd = studentsToAdd.map(student => ({
      email: student.email,
      role: role,
    }));

    console.log("studentToAd", studentsToAdd.length);
    console.log("userStudentsToAdd", userStudentsToAdd.length);

    await this.userEntity.save(userStudentsToAdd);
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
