import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import {Not, Repository} from 'typeorm';
import { Student } from './entities/student.entity';
import { Profile } from './entities/profile.entity';
import { UpdatetudentProfileDto } from './dto/update-student.dto';
import {StudentStatus} from "../types/students";
import {StudentListToHr} from "../types/student/student-list-to-hr";

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentEntity: Repository<Student>,
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Profile) private profileEntity: Repository<Profile>,
  ) {}

  async findAll() {

    const activeStudents = await this.studentEntity.find({
      where: { isActive: true },
      relations: ['profile', 'user'],
    });

    activeStudents.forEach(student => {
      console.log(`Student ID: ${student.id}, Updated At: ${student.user.updatedAt}`);
    });

    return activeStudents;
  }

  async findAllToHr():Promise<StudentListToHr[]> {

    const activeStudents = await this.studentEntity.find({
      where: { isActive: true,
            status: Not (StudentStatus.Employed)
          },
      relations: ['profile', 'user'],
    });

    const studentListToHr: StudentListToHr[] = activeStudents.map(student => {
      return {
        firstName: student.profile?.firstName,
        lastName: student.profile?.lastName,
        courseCompletion: student.courseCompletion,
        courseEngagement: student.courseEngagement,
        projectDegree: student.projectDegree,
        teamProjectDegree: student.teamProjectDegree,
        expectedTypeWork: student.profile.expectedTypeWork,
        targetWorkCity: student.profile.targetWorkCity,
        expectedContractType: student.profile.expectedContractType,
        expectedSalary: student.profile.expectedSalary,
        canTakeApprenticeship: student.profile.canTakeApprenticeship,
        monthsOfCommercialExp: student.profile.monthsOfCommercialExp,
      };
    });
    return studentListToHr;
  }

  findOne(id: number) {

    return `This action returns a #${id} student`;
  }

  async updateProfile(
      studentId: string,
      updateProfileDto: UpdatetudentProfileDto,
  ) {
    const student: Student = await this.studentEntity.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new BadRequestException(
          `Nie mamy w bazie studenta o id: ${studentId}.`,
      );
    }

    const existingProfile: Profile = await this.profileEntity.findOne({
      where: [{ githubUsername: updateProfileDto.githubUsername }],
    });

    const profile = new Profile();
    if (existingProfile) {
      for (const key in updateProfileDto) {
        existingProfile[key] = updateProfileDto[key];
      }
      await this.profileEntity.save(existingProfile);
    } else {
      profile.student = student;
      for (const key in updateProfileDto) {
        profile[key] = updateProfileDto[key];
      }
      await this.profileEntity.save(profile);
    }

    await this.studentEntity.update({ id: student.id }, { isActive: true });
    delete profile.student;
    return existingProfile ? existingProfile : profile;
  }

  async updateStudentStatus (
      studentId: string,
      studentStatus: StudentStatus,
  ) {
    const student: Student = await this.studentEntity.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new BadRequestException(`Nie mamy w bazie studenta o id: ${studentId}.`);
    }
    await this.studentEntity.update({ id: student.id }, { status: studentStatus });

    return "Zmieniono status na zatrudniony";
  }

  async getStudentCV(id) {

    const student = await this.studentEntity.findOne({
      where: { id: id,
      },
      relations: ['profile', 'user'],
    });
    if (!student) {
      return `Student with ID ${id} not found.`;
    }

    const studentCV = {
      firstName: student.profile.firstName,
      lastName: student.profile.lastName,
      bio: student.profile.bio,
      githubUsername: student.profile.githubUsername,
      courseCompletion: student.courseCompletion,
      courseEngagement: student.courseEngagement,
      projectDegree: student.projectDegree,
      teamProjectDegree: student.teamProjectDegree,
      portfolioUrls: student.profile.portfolioUrls,
      bonusProjectUrls: student.bonusProjectUrls,
      projectUrls: student.profile.projectUrls,
      expectedTypeWork: student.profile.expectedTypeWork,
      targetWorkCity: student.profile.targetWorkCity,
      expectedContractType: student.profile.expectedContractType,
      expectedSalary: student.profile.expectedSalary,
      canTakeApprenticeship: student.profile.canTakeApprenticeship,
      monthsOfCommercialExp: student.profile.monthsOfCommercialExp,
      education: student.profile.education,
      workExperience: student.profile.workExperience,
    };
    return studentCV;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
