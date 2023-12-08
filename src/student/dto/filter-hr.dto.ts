import { ExpectedContractType, ExpectedTypeWork } from '../../types';

export class FilterHrDto {
  courseCompletion: number[];
  courseEngagement: number[];
  projectDegree: number[];
  teamProjectDegree: number[];
  expectedTypeWork: ExpectedTypeWork;
  expectedContractType: ExpectedContractType;
  expectedSalary: [number, number];
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
}
