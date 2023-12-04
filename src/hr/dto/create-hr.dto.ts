import {UserRole} from "../../types";
import {IsEmail, IsInt, IsNotEmpty, Max, Min, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class HrDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    company: string;

    @IsInt()
    @Min(1)
    @Max(999)
    maxReservedStudents: number;
}

export class CreateHrDto {
    @ValidateNested()
    @Type(() => HrDto)
    hrs: HrDto[];
}

export class CreateUserHrToAdd {
    email: string;
    role: UserRole;
}