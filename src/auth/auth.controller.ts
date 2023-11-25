import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() dto: SignInDto, @Res() res: Response) {
    return this.authService.signIn(dto, res);
  }

  @Get('sign-out')
  signOut(@Res() res: Response) {
    return this.authService.signOut(res);
  }
}
