import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CommonUserType } from 'src/common/common_type';
import { KHSErrorCode } from 'src/common/exception/error_code';
import { KHSException } from 'src/common/exception/exception_model';

@Injectable()
export class ScopeAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  getRequest(context: ExecutionContext) {
    switch (context.getType().toString()) {
      case 'http':
        return context.switchToHttp().getRequest();
      case 'graphql':
        return GqlExecutionContext.create(context).getContext().req;
      default:
        throw new KHSException(KHSErrorCode.ERROR, 7829);
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const scopes = this.reflector.get<CommonUserType[]>(
      'scopes',
      context.getHandler(),
    );
    if (!scopes || scopes.length == 0) {
      return true;
    }

    if (!this.matchScopes(scopes, this.getRequest(context).user.scopes)) {
      if (context.getType().toString() === 'graphql') {
        throw new UnauthorizedException(KHSErrorCode.NOT_ALLOWED_USER);
      } else {
        throw new KHSException(KHSErrorCode.NOT_ALLOWED_USER, 7829);
      }
    }
    return true;
  }

  matchScopes(
    scopes: CommonUserType[],
    userScopes: CommonUserType[],
  ): boolean {
    if (userScopes == null) return false;
    return userScopes.some(
      (userScope) => scopes.find((scope) => scope === userScope) != undefined,
    );
  }
}
