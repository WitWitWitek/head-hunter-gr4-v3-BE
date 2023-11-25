import { AuthGuard } from '@nestjs/passport';
import { TokenStrategyName } from '../strategy';

export class AccessTokenGuard extends AuthGuard(TokenStrategyName.accessToken) {
  constructor() {
    super();
  }
}
