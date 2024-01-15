import { AuthGuard } from '@nestjs/passport';
import { TokenStrategyName } from 'src/types';

export class RefreshTokenGuard extends AuthGuard(
  TokenStrategyName.refreshToken,
) {
  constructor() {
    super();
  }
}
