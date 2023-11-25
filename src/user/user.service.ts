import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { UserRole } from 'src/types';

@Injectable()
export class UserService {
  private userService: UserService[] = [];

  constructor(@InjectRepository(User) private userEntity: Repository<User>) {}

  async create(createUserDto: CreateUserDto, role: UserRole) {
    const hashedPassword = await hash(createUserDto.password, 10);
    await this.userEntity.save({
      ...createUserDto,
      password: hashedPassword,
      role: role,
    });
    return `New user with ${role} created.`;
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const { password, email, username } = createUserDto;

    const hashedPassword = await hash(password, 10);

    const adminUser = new User();
    adminUser.username = username;
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
