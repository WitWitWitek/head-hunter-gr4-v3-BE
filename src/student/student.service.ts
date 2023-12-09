import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Profile } from './entities/profile.entity';
import { UpdatetudentProfileDto } from './dto/update-student.dto';
import { StudentStatus } from '../types/students';
import { FilterHrDto } from './dto/filter-hr.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentEntity: Repository<Student>,
    @InjectRepository(Profile) private profileEntity: Repository<Profile>,
    private readonly userService: UserService,
  ) {}

  async findAll() {
    const activeStudents = await this.studentEntity.find({
      where: { isActive: true },
      relations: ['profile', 'user'],
    });

    activeStudents.forEach((student) => {
      console.log(
        `Student ID: ${student.id}, Updated At: ${student.user.updatedAt}`,
      );
    });

    return activeStudents;
  }

  async findAllToHr() {
    const activeStudents = await this.studentEntity.find({
      where: { isActive: true, status: Not(StudentStatus.Employed) },
      relations: ['profile', 'user'],
    });

    return activeStudents;
  }

  async findFilteredToHr(
    filterHr: FilterHrDto,
    page: number,
    limit: number,
  ): Promise<{
    students: Student[];
    studentsCount: number;
    lastPage: number;
  }> {
    const queryBuilder = this.studentEntity
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.profile', 'profile')
      .take(limit)
      .skip((page - 1) * limit);

    if (filterHr.courseCompletion && filterHr.courseCompletion.length > 0) {
      queryBuilder.andWhere(
        'student.courseCompletion IN (:...courseCompletion)',
        {
          courseCompletion: filterHr.courseCompletion,
        },
      );
    }

    if (filterHr.courseEngagement && filterHr.courseEngagement.length > 0) {
      queryBuilder.andWhere(
        'student.courseEngagement IN (:...courseEngagement)',
        {
          courseEngagement: filterHr.courseEngagement,
        },
      );
    }

    if (filterHr.projectDegree && filterHr.projectDegree.length > 0) {
      queryBuilder.andWhere('student.projectDegree IN (:...projectDegree)', {
        projectDegree: filterHr.projectDegree,
      });
    }

    if (filterHr.teamProjectDegree && filterHr.teamProjectDegree.length > 0) {
      queryBuilder.andWhere(
        'student.teamProjectDegree IN (:...teamProjectDegree)',
        {
          teamProjectDegree: filterHr.teamProjectDegree,
        },
      );
    }

    if (filterHr.expectedTypeWork) {
      queryBuilder.andWhere('profile.expectedTypeWork = :expectedTypeWork', {
        expectedTypeWork: filterHr.expectedTypeWork,
      });
    }

    if (filterHr.expectedContractType) {
      queryBuilder.andWhere(
        'profile.expectedContractType = :expectedContractType',
        {
          expectedContractType: filterHr.expectedContractType,
        },
      );
    }

    if (filterHr.expectedSalary) {
      const [minSalary, maxSalary] = filterHr.expectedSalary;
      queryBuilder.andWhere('profile.expectedSalary >= :minSalary', {
        minSalary,
      });
      queryBuilder.andWhere('profile.expectedSalary <= :maxSalary', {
        maxSalary,
      });
    }

    if (filterHr.canTakeApprenticeship !== undefined) {
      queryBuilder.andWhere(
        'profile.canTakeApprenticeship = :canTakeApprenticeship',
        {
          canTakeApprenticeship: filterHr.canTakeApprenticeship,
        },
      );
    }

    if (filterHr.monthsOfCommercialExp) {
      queryBuilder.andWhere(
        'profile.monthsOfCommercialExp >= :monthsOfCommercialExp',
        {
          monthsOfCommercialExp: filterHr.monthsOfCommercialExp,
        },
      );
    }
    queryBuilder.andWhere('student.isActive = :isActive', { isActive: true });
    queryBuilder.andWhere('student.status != :status', {
      status: StudentStatus.Employed,
    });
    const students = await queryBuilder.getMany();

    const studentsCount = await queryBuilder.getCount();

    const lastPage = Math.ceil(studentsCount / limit);

    return {
      studentsCount,
      lastPage,
      students,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  async updateProfile(
    studentId: string,
    updateProfileDto: UpdatetudentProfileDto,
    user: User,
  ) {
    const student: Student = await this.studentEntity.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new BadRequestException(
        `Nie mamy w bazie studenta o id: ${studentId}.`,
      );
    }

    if (updateProfileDto.email) {
      await this.userService.updateUserEmail(
        user.email,
        updateProfileDto.email,
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

  async updateStudentStatus(studentId: string, studentStatus: StudentStatus) {
    const student: Student = await this.studentEntity.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new BadRequestException(
        `Nie mamy w bazie studenta o id: ${studentId}.`,
      );
    }
    await this.studentEntity.update(
      { id: student.id },
      { status: studentStatus },
    );

    return 'Zmieniono status na zatrudniony';
  }

  async getStudentCV(id: string) {
    const student = await this.studentEntity.findOne({
      where: { id: id },
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
