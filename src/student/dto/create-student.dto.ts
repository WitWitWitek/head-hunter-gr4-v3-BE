import {UserRole} from "../../types/user/user.entity";

export class CreateStudentDto {
    email: string;
    courseCompletion: number;
    courseEngagement: number;
    projectDegree: number;
    teamProjectDegree: number;
    bonusProjectUrls: string[];
}

export class CreateUserStudentToAdd {
    email: string;
    role: UserRole;
}
