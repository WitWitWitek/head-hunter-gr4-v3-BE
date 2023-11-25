import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
