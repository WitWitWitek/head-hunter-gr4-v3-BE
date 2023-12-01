import {ExpectedContractType, ExpectedTypeWork} from "../entities/profile.entity";

//export class UpdateStudentDto extends PartialType(CreateStudentDto) {

export type UpdatetudentProfileDto = {
    tel: string;
    firstName: string;
    lastName: string;
    githubUsername: string;
    portfolioUrls: string[];
    projectUrls: string[];
    bio: string;
    expectedTypeWork: ExpectedTypeWork;
    targetWorkCity: string;
    expectedContractType: ExpectedContractType;
    expectedSalary: number;
    canTakeApprenticeship: boolean;
    monthsOfCommercialExp: number;
    education: string;
    workExperience: string;
    courses: string;
}
