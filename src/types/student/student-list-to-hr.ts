import {ExpectedContractType, ExpectedTypeWork} from "./profile";

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