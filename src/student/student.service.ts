import {Injectable, NotFoundException} from '@nestjs/common';
import { UpdateStudentDto } from './dto/update-student.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {Student} from "./entities/student.entity";

@Injectable()
export class StudentService {
  private studentService: StudentService[] = [];

  constructor(@InjectRepository(Student) private studentEntity: Repository<Student>,
              @InjectRepository(User) private userEntity: Repository<User>,
  ) {}

    findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }



  async updateStudent(id: string, updateStudentDto: UpdateStudentDto) {

    const existingStudent: Student = await this.studentEntity.findOne({
      where: {id: id}
    });

    if (!existingStudent) {
      throw new NotFoundException(`Student with email ${id} not found`);
    }

    existingStudent.courseCompletion = updateStudentDto.courseCompletion;
    existingStudent.courseEngagement = updateStudentDto.courseEngagement;
    existingStudent.projectDegree = updateStudentDto.projectDegree;
    existingStudent.teamProjectDegree= updateStudentDto.teamProjectDegree;
    existingStudent.bonusProjectUrls = updateStudentDto.bonusProjectUrls;
    await this.studentEntity.save(existingStudent);

    return `This action updates a #${id} student`;
  }




  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
