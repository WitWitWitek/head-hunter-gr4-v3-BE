import { AuthGuard } from '@nestjs/passport';
import { TokenStrategyName } from 'src/types';

export class AccessTokenGuard extends AuthGuard(TokenStrategyName.accessToken) {
  constructor() {
    super();
  }
}
