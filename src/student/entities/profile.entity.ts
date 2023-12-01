import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import {IsInt, Min} from "class-validator";
import {Student} from "./student.entity";

export enum ExpectedTypeWork {
    OnSite = ' Na miejscu',
    Relocation = 'Gotowość do przeprowadzki',
    Remote = 'Wyłącznie zdalnie',
    Hybrid = 'Hybrydowo',
    Any = 'Bez znaczenia',
}

export enum ExpectedContractType {
    UoP = 'UoP',
    B2B = 'B2B',
    UZ_UoD = 'UZ/UoD',
    Any = 'Brak preferencji',
}

@Entity('profile')
@Unique(['email', 'githubUsername'])
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        length: 100,
        unique: true,
    })
    email: string;

    @Column({
        nullable: true
    })
    tel: string;

    @Column({
        nullable: false,
    })
    firstName: string;

    @Column({
        nullable: false,
        }
    )
    lastName: string;

    @Column({
        unique: true
    })
    githubUsername: string;

    @Column('simple-array', {
        nullable: true
    })
    portfolioUrls: string[];

    @Column('simple-array', {
        nullable: false
    })
    projectUrls: string[];

    @Column({
        nullable: true
    })
    bio: string;

    @Column({
        type: 'enum',
        enum: ExpectedTypeWork,
        default: ExpectedTypeWork.Any,
    })
    expectedTypeWork: ExpectedTypeWork;

    @Column({
        nullable: true
    })
    targetWorkCity: string;

    @Column({
        type: 'enum',
        enum: ExpectedContractType,
        default: ExpectedContractType.Any,
    })
    expectedContractType: ExpectedContractType;

    @Column({
        nullable: true
    })
    expectedSalary: number;

    @Column({
        default: false
    })
    canTakeApprenticeship: boolean;

    @Column({
        default: 0
    })
    @IsInt()
    @Min(0)
    monthsOfCommercialExp: number;

    @Column({
        nullable: true,
        type: "text"
    })
    education: string;

    @Column({
        nullable: true,
        type: "text"
    })
    workExperience: string;

    @Column({
        nullable: true,
        type: "text"
    })
    courses: string;

    // Relacja z użytkownikiem (OneToOne)
    @OneToOne(type => Student, student => student.profile)
    student: Student;
}
