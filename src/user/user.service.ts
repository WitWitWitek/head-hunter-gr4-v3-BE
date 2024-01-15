import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { PASSWORD_REGEXP, UserRole } from 'src/types';
import { MailService } from '../mail/mail.service';
import { hashData, verifyHashedData } from '../utils';
import { Hr } from '../hr/entities/hr.entity';
import { CreateHrDto } from '../hr/dto/create-hr.dto';
import { UpdatePasswordDto, CreateUserDto } from './dto';
import { StudentDto } from 'src/student/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Student) private studentEntity: Repository<Student>,
    @InjectRepository(Hr) private hrEntity: Repository<Hr>,
    private mailService: MailService,
  ) {}

  async createStudent(newStudent: StudentDto, role: UserRole) {
    const user = await this.findOneByEmail(newStudent.email);
    if (user) {
      throw new BadRequestException(
        `Użytkownik z emailem: ${newStudent.email} już istnieje!`,
      );
    }

    const student = new Student();
    for (const key in newStudent) {
      student[key] = newStudent[key];
    }
    await this.studentEntity.save(student);

    const userStudent = new User();
    userStudent.email = newStudent.email;
    userStudent.role = role;
    userStudent.student = student;
    await this.userEntity.save(userStudent);

    await this.mailService.sendUserConfirmation(userStudent);

    return {
      message: `Nowy student z emailem: ${newStudent.email} dodany.`,
    };
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    const hashedPassword = await hashData(password);

    const existingUser = await this.findOneByEmail(email);
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
      message: `${user.email} pomyślnie zweryfikowany.`,
    };
  }

  async createHr(newHr: CreateHrDto, role: UserRole) {
    const existingHr = await this.findOneByEmail(newHr.email);

    if (existingHr && existingHr.role === UserRole.HR) {
      throw new BadRequestException(
        `Użytkownik z emailem: ${existingHr.email} już istnieje!`,
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
    const foundUser = await this.findOneByEmail(newEmail);
    if (foundUser) {
      throw new BadRequestException('Użytkownik o takim mailu juz istnieje!');
    }

    const userToUpdate = await this.findOneByEmail(oldEmail);
    if (!userToUpdate) {
      throw new BadRequestException('Użytkownik o takim mailu nie istnieje!');
    }

    userToUpdate.email = newEmail;
    await userToUpdate.save();
  }

  async remindPassword(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Użytkownik nie istnieje!');
    }
    const newPassword = this.generateNewPassword();

    user.password = await hashData(newPassword);
    user.save();

    await this.mailService.sendNewUserPassword(user, newPassword);

    return {
      message: `Email do ${user.email} zawierający nowe hasło wysłany.`,
    };
  }

  async updateUserPassword(user: User, updatePasswordDto: UpdatePasswordDto) {
    const { newPassword, oldPassword } = updatePasswordDto;

    const passwordsMatch = await verifyHashedData(oldPassword, user.password);
    if (!passwordsMatch) {
      throw new BadRequestException('Aktualne hasło jest niepoprawne!');
    }

    user.password = await hashData(newPassword);
    await this.userEntity.save(user);
    return {
      message: `Hasło użytkownika ${user.email} zostało zaktualizowane.`,
    };
  }

  generateNewPassword(): string {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let password = '';
    for (let i = 0; i < 10; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return PASSWORD_REGEXP.test(password)
      ? password
      : this.generateNewPassword();
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
