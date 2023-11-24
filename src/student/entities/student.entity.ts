import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('student')
export class Student extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        length: 100,
        unique: true,
    })
    email: string;

    @Column({
        type: 'decimal',
        precision: 1,
        nullable: true
    })
    courseCompletion: number;

    @Column({
        type: 'decimal',
        precision: 1,
        nullable: true
    })
    courseEngagement: number;

    @Column({
        type: 'decimal',
        precision: 1,
        nullable: true
    })
    projectDegree: number;

    @Column({
        type: 'decimal',
        precision: 1,
        nullable: true
    })
    teamProjectDegree: number;

    @Column(
        'simple-array',
        {
            nullable: true
        })
    bonusProjectUrls: string[];

}
