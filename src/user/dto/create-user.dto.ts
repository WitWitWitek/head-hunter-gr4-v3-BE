import {UserRole} from "../../types";

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export class CreateUserStudentToAdd {
  email: string;
  role: UserRole;
}
