import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateStudentDto, UserRole } from 'src/types';
import { In } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { hashData } from '../utils';
import { Hr } from '../hr/entities/hr.entity';
import { CreateHrDto } from '../hr/dto/create-hr.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Student) private studentEntity: Repository<Student>,
    @InjectRepository(Hr) private hrEntity: Repository<Hr>,
    private mailService: MailService,
  ) {}

  async createStudent(newStudents: CreateStudentDto, role: UserRole) {
    const { students } = newStudents;
    const emails = students.map((student) => student.email);
    const existingStudents = await this.userEntity.find({
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

    const studentsEntites = studentsToAdd.map((studentDto) => {
      const student = new Student();
      for (const key in studentDto) {
        student[key] = studentDto[key];
      }
      return student;
    });
    await this.studentEntity.save(studentsEntites);

    const userStudentsToAdd = studentsEntites.map((student, index) => {
      const user = new User();
      user.email = studentsToAdd[index].email;
      user.role = role;
      user.student = student;
      return user;
    });
    await this.userEntity.save(userStudentsToAdd);

    for await (const newUser of userStudentsToAdd) {
      await this.mailService.sendUserConfirmation(newUser);
    }

    return {
      message: `Added ${studentsToAdd.length} of ${students.length}.`,
    };
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    const hashedPassword = await hashData(password);

    const existingUser = this.userEntity.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException(`Email: ${email} już istnieje!`);
    }
    const adminUser = new User();
    adminUser.password = hashedPassword;
    adminUser.email = email;
    adminUser.role = UserRole.Admin;
    adminUser.confirmed = true;

    await this.userEntity.save(adminUser);
  }

  async confirmUser(user: User, password: string) {
    const hashedPassword = await hashData(password);
    if (user.confirmed) {
      throw new BadRequestException(
        'Użytkownik został wcześniej zweryfikowany.',
      );
    }
    user.password = hashedPassword;
    user.confirmed = true;

    await this.userEntity.save(user);
    return {
      message: `${user.email} successfully confirmed`,
    };
  }

  async createHr(newHr: CreateHrDto, role: UserRole) {
    const existingHr = await this.userEntity.findOne({
      where: {
        email: newHr.email,
        role: role,
      },
    });
    if (existingHr) {
      throw new BadRequestException(
        `Użytkownik z emailem: ${existingHr.email} istnieje!`,
      );
    }

    const newHrUser = new User();
    newHrUser.email = newHr.email;
    newHrUser.role = role;
    await newHrUser.save();

    const hr = new Hr();
    hr.user = newHrUser;
    hr.fullName = newHr.fullName;
    hr.company = newHr.company;
    hr.maxReservedStudents = newHr.maxReservedStudents;
    await hr.save();

    await this.mailService.sendUserConfirmation(newHrUser);
    return {
      message: `${newHr.email} dodany do listy HR`,
    };
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userEntity.findOne({
      where: {
        email,
      },
      relations: ['student', 'student.profile', 'hr'],
    });
  }

  async updateUserEmail(oldEmail: string, newEmail: string) {
    const foundUser = await this.userEntity.findOne({
      where: {
        email: newEmail,
      },
    });
    if (foundUser) {
      throw new BadRequestException('Użytkownik o takim mailu juz istnieje!');
    }

    const userToUpdate = await this.userEntity.findOne({
      where: {
        email: oldEmail,
      },
    });
    if (!userToUpdate) {
      throw new BadRequestException('Użytkownik o takim mailu nie istnieje!');
    }

    userToUpdate.email = newEmail;
    await userToUpdate.save();
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
}
