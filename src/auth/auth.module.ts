import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategy';

@Module({
  imports: [forwardRef(() => UserModule), JwtModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
})
export class AuthModule {}
