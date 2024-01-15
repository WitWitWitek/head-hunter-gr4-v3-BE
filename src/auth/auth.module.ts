import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AccessTokenStrategy, RefreshTokenStrategy } from '../token/strategies';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => TokenModule)],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
