import {ExpectedContractType, ExpectedTypeWork} from "./profile";
import {Student} from "../../student/entities/student.entity";

export interface GetStudentListToAdminPaginationResponse {
    surdents: Student[];
    totalPages: number;
}




export type StudentListToHr = {

    firstName: string;
    lastName: string;

        courseCompletion: number;
        courseEngagement: number;
        projectDegree: number;
        teamProjectDegree: number;

    expectedTypeWork: ExpectedTypeWork;
    targetWorkCity: string;
    expectedContractType: ExpectedContractType;
    expectedSalary: number;
    canTakeApprenticeship: boolean;
    monthsOfCommercialExp: number;
}