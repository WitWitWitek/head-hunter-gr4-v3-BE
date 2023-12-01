import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {Student} from "./entities/student.entity";
import {Profile} from "./entities/profile.entity";
import {UpdatetudentProfileDto} from "./dto/update-student.dto";

@Injectable()
export class StudentService {
  private studentService: StudentService[] = [];

  constructor(@InjectRepository(Student) private studentEntity: Repository<Student>,
              @InjectRepository(User) private userEntity: Repository<User>,
              @InjectRepository(Profile) private profileEntity: Repository<Profile>,
  ) {}

  // async create() {  // tworzony przez Admina w UserSerwice
  //   return `This action returns all student`;
  // }


  findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  async updateProfile(studentId: string, updateProfileDto: UpdatetudentProfileDto) {
    const existingProfile: Student  = await this.studentEntity.findOne({
      where: { id: studentId },
    });

    if (!existingProfile) {
      throw new Error(`Nie mamy w bazie studenta o id: ${studentId}.`);
    }

    const { tel, firstName, lastName, githubUsername, portfolioUrls, projectUrls, bio, expectedTypeWork, targetWorkCity, expectedContractType, expectedSalary, canTakeApprenticeship, monthsOfCommercialExp, education, workExperience, courses } = updateProfileDto;
    await this.profileEntity.save({
      ...existingProfile,
      tel,
      firstName,
      lastName,
      githubUsername,
      portfolioUrls,
      projectUrls,
      bio,
      expectedTypeWork,
      targetWorkCity,
      expectedContractType,
      expectedSalary,
      canTakeApprenticeship,
      monthsOfCommercialExp,
      education,
      workExperience,
      courses,
    });
    await this.studentEntity.update({ id: existingProfile.id }, { isActive: true });
    return updateProfileDto;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
