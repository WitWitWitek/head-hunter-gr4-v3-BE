import { AuthGuard } from '@nestjs/passport';
import { TokenStrategyName } from 'src/types';

export class ConfirmationTokenGuard extends AuthGuard(
  TokenStrategyName.confirmationToken,
) {
  constructor() {
    super();
  }
}
