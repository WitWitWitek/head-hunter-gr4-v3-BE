export enum ExpectedTypeWork {
  OnSite = 'Na miejscu',
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

export type StudentProfile = {
  phone: string;
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
};

