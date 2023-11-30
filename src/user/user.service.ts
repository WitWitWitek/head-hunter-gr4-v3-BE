import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/types';
import { hashData } from 'src/utils';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto, role: UserRole) {
    const { password } = createUserDto;
    const hashedPassword = await hashData(password);
    const user = await this.userEntity.save({
      ...createUserDto,
      password: hashedPassword,
      role: role,
    });
    await this.mailService.sendUserConfirmation(user);
    return `New user with ${role} created.`;
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { password, email, username } = createUserDto;

    const hashedPassword = await hashData(password);

    const adminUser = new User();
    adminUser.username = username;
    adminUser.password = hashedPassword;
    adminUser.email = email;
    adminUser.role = UserRole.Admin;
    adminUser.confirmed = true;

    await this.userEntity.save(adminUser);
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
