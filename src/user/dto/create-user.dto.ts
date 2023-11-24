export class CreateUserDto {
    id: string;
    username: string;
    email: string;
    password: string;
    confirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
