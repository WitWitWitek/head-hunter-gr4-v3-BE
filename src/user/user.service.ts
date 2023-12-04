import {Injectable, Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStudentDto, CreateUserStudentToAdd, UserRole } from 'src/types';
import { In } from 'typeorm';
import {MailService} from "../mail/mail.service";
import {hashData} from "../utils";
import {Hr} from "../hr/entities/hr.entity";
import {CreateHrDto, CreateUserHrToAdd} from "../hr/dto/create-hr.dto";


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Student) private studentEntity: Repository<Student>,
    @InjectRepository(Hr) private hrEntity: Repository<Hr>,
    private mailService: MailService,
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

     //await this.mailService.sendUserConfirmation(user);
    await this.userEntity.save(userStudentsToAdd);
    return `Added ${studentsToAdd.length} of ${students.length}.`;
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    const hashedPassword = await hashData(password);

    const adminUser = new User();
    adminUser.password = hashedPassword;
    adminUser.email = email;
    adminUser.role = UserRole.Admin;
    adminUser.confirmed = true;

    await this.userEntity.save(adminUser);
  }

  async createHr(
      newHr: CreateHrDto,
      role: UserRole):Promise<string> {

    const {hrs} = newHr;
    const emails = hrs.map((student) => student.email);
    const existingHrs = await this.hrEntity.find({
      where: {
        email: In(emails),
      }
    });
    const existingHrsEmails = existingHrs.map(
        (existingHr) => existingHr.email,
    );
    const hrToAdd = hrs.filter(
        newHr => !existingHrsEmails.includes(newHr.email),
    )
    await this.hrEntity.save(hrToAdd);

    const userHrsToAdd: CreateUserHrToAdd[] = hrToAdd.map(
        (hr) => ({
          email: hr.email,
          role: role,
        })
    )
    console.log("data", Date());
    //await this.mailService.sendUserConfirmation(user);
    await this.userEntity.save(userHrsToAdd);

    return `Added ${hrToAdd.length} of ${hrs.length}.`;
  }

  findAll() {
    return this.userEntity.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userEntity.findOne({
      where: {
        email,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  updateLoginToken(id: string, hashedRefreshToken?: string) {
    return this.userEntity
      .createQueryBuilder()
      .update(User)
      .set({ loginToken: hashedRefreshToken ?? null })
      .where('id = :id', {
        id,
      })
      .execute();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
