import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsEmail, IsInt, IsNotEmpty, Max, Min} from "class-validator";

@Entity ('hr')
export class Hr extends BaseEntity {
    @PrimaryGeneratedColumn ('uuid')
    id: string;

    @Column({
        nullable: false,
        length: 100,
        unique: true,
    })
    email: string;

    @Column({
        nullable: false,
        length: 100,
    })
    fullName: string;

    @Column ({
        nullable: false,
        length: 100,
    })
    company: string;

    @Column ({
        nullable: false,
    })
    @IsInt()
    @Min(1)
    @Max(999)
    maxReservedStudents: number;

}
