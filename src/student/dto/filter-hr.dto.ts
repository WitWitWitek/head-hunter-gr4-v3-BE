export class FilterHrDto {
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  expectedTypeWork: string[];
  expectedContractType: string[];
  expectedSalary: [number, number];
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
}
