import { Injectable } from '@nestjs/common';
import { UpdateHrDto } from './dto/update-hr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { Hr } from './entities/hr.entity';

@Injectable()
export class HrService {
  private hrService: HrService[] = [];

  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Student) private studentEntity: Repository<Student>,
    @InjectRepository(Hr) private hrEntity: Repository<Hr>,
  ) {}

  findAll() {
    return `This action returns all hr`;
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
