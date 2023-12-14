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

  async findAllToHr(hrUser: User) {
    const user = await this.userEntity.findOne({
      where: { id: hrUser.id },
      relations: ['hr'],
    });
    const students = await this.userEntity.find({
      where: {
        student: {
          hr: {
            id: user.hr.id,
          },
        },
      },
      relations: ['student', 'student.profile'],
    });

    return {
      students: students,
    };
  }

  async findFilteredToHr(
    filterHr: FilterHrDto,
    search: string,
    page: number,
    limit: number,
  ): Promise<{
    students: User[];
    studentsCount: number;
    lastPage: number;
  }> {
    const queryBuilder = this.userEntity
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.student', 'student', 'student.userId = user.id')
      .leftJoinAndSelect('student.profile', 'profile')
      .take(limit)
      .skip((page - 1) * limit);

    if (search) {
      queryBuilder.andWhere(
        '(profile.firstName Like :search OR profile.lastName Like :search)',
        { search: `%${search}%` },
      );
    }

    if (filterHr.courseCompletion) {
      queryBuilder.andWhere('student.courseCompletion >= :courseCompletion ', {
        courseCompletion: filterHr.courseCompletion,
      });
    }

    if (filterHr.courseEngagement) {
      queryBuilder.andWhere('student.courseEngagement >= :courseEngagement', {
        courseEngagement: filterHr.courseEngagement,
      });
    }

    if (filterHr.projectDegree) {
      queryBuilder.andWhere('student.projectDegree >= :projectDegree', {
        projectDegree: filterHr.projectDegree,
      });
    }

    if (filterHr.teamProjectDegree) {
      queryBuilder.andWhere('student.teamProjectDegree >= :teamProjectDegree', {
        teamProjectDegree: filterHr.teamProjectDegree,
      });
    }

    if (filterHr.expectedTypeWork && filterHr.expectedTypeWork.length > 0) {
      queryBuilder.andWhere(
        'profile.expectedTypeWork IN (:...expectedTypeWork)',
        {
          expectedTypeWork: filterHr.expectedTypeWork,
        },
      );
    }

    if (filterHr.expectedContractType) {
      queryBuilder.andWhere(
        'profile.expectedContractType IN (:...expectedContractType)',
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
    queryBuilder.andWhere('student.status != :status ', {
      status: StudentStatus.InInterview,
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
