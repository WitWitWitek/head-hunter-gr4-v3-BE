import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Profile } from './entities/profile.entity';
import { UpdatetudentProfileDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentEntity: Repository<Student>,
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Profile) private profileEntity: Repository<Profile>,
  ) {}

  findAll() {
    return `This action returns all student`;
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
      this.profileEntity.save(existingProfile);
    } else {
      profile.student = student;
      for (const key in updateProfileDto) {
        profile[key] = updateProfileDto[key];
      }
      this.profileEntity.save(profile);
    }

    await this.studentEntity.update({ id: student.id }, { isActive: true });
    delete profile.student;
    return existingProfile ? existingProfile : profile;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
