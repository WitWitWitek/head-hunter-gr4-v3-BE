import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    @InjectRepository(User) private userEntity: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async findAlltoAdmin(currentPage: number = 1) {
    const maxPerPage = 3;

    const [activeStudents, countStudents] =
      await this.studentEntity.findAndCount({
        relations: ['profile', 'user'],
        skip: maxPerPage * (currentPage - 1),
        take: maxPerPage,
      });
    const totalPages = Math.ceil(countStudents / maxPerPage);

    return {
      activeStudents,
      totalPages,
    };
  }

  async findAllToHr(currentPage: number = 1) {
    const maxPerPage = 3;
    const [activeStudents, countStudents] =
      await this.studentEntity.findAndCount({
        where: { isActive: true, status: StudentStatus.Available },
        relations: ['profile', 'user'],
        skip: maxPerPage * (currentPage - 1),
        take: maxPerPage,
      });
    const totalPages = Math.ceil(countStudents / maxPerPage);

    return {
      activeStudents,
      totalPages,
    };
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

  async findOne(user: User) {
    const student = await this.userEntity.findOne({
      where: { id: user.id },
      relations: ['student', 'student.profile'],
    });
    delete student.password;
    delete student.loginToken;
    return student;
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

    if (updateProfileDto.email !== user.email) {
      await this.userService.updateUserEmail(
        user.email,
        updateProfileDto.email,
      );
    }

    const existingProfile: Profile = student.profile;

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

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
