import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { Response, Request } from 'express';
import { RefreshTokenGuard } from './guard/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() dto: SignInDto, @Res() res: Response) {
    return this.authService.signIn(dto, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('sign-out')
  signOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.signOut(req, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshToken(@Req() req: Request) {
    return this.authService.refresh(req);
  }
}
