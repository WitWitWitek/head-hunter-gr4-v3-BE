import { Injectable } from '@nestjs/common';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {Student} from "../student/entities/student.entity";


@Injectable()
export class HrService {
  private hrService: HrService[] = [];

  constructor(@InjectRepository(User) private userEntity: Repository<User>,
              @InjectRepository(Student) private studentEntity: Repository<Student>,
  ) {}

  create(createHrDto: CreateHrDto) {
    return 'This action adds a new hr';
  }

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
