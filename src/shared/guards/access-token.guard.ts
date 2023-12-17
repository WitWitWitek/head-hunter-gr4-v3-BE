import { AuthGuard } from '@nestjs/passport';
import { TokenStrategyName } from 'src/types';
import { Reflector } from '@nestjs/core';
import { CanActivate } from '@nestjs/common';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { PUBLIC_ROUTE_KEY } from '../decorators';

@Injectable()
export class AccessTokenGuard
  extends AuthGuard(TokenStrategyName.accessToken)
  implements CanActivate
{
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublicRoute = this.reflector.getAllAndOverride(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublicRoute) return true;

    return super.canActivate(context);
  }
}
