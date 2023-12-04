import { Injectable } from '@nestjs/common';
import {CreateHrDto, CreateUserHrToAdd} from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {In, Repository} from "typeorm";
import {Student} from "../student/entities/student.entity";
import {UserRole} from "../types";
import {Hr} from "./entities/hr.entity";


@Injectable()
export class HrService {
  private hrService: HrService[] = [];

  constructor(@InjectRepository(User) private userEntity: Repository<User>,
              @InjectRepository(Student) private studentEntity: Repository<Student>,
              @InjectRepository(Hr) private hrEntity: Repository<Hr>,
  ) {}

  // async createHr(
  //     newHrs: CreateHrDto,
  //     role: UserRole,
  // ):Promise<string> {
  //
  //   const { hrs} = newHrs;
  //
  //   console.log("Hrs",hrs);
  //   const emails = hrs.map((student) => student.email);
  //   const existingHrs = await this.hrEntity.find({
  //     where: {
  //       email: In(emails),
  //     }
  //   });
  //
  //   const existingHrsEmails = existingHrs.map(
  //       (existingHr) => existingHr.email,
  //   );
  //   const hrToAdd = hrs.filter(
  //       newHr => !existingHrsEmails.includes(newHr.email),
  //   )
  //
  //   await this.hrEntity.save(hrToAdd);
  //
  //   const userHrsToAdd: CreateUserHrToAdd[] = hrToAdd.map(
  //       (hr) => ({
  //         email: hr.email,
  //         role: role,
  //       })
  //   )
  //
  //   //await this.mailService.sendUserConfirmation(user);
  //   await this.userEntity.save(userHrsToAdd);
  //   return 'This action adds a new hr';
  // }

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
