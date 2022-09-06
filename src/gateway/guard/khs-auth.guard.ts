import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { KHSErrorCode } from 'src/common/exception/error_code';
import { KHSException } from 'src/common/exception/exception_model';
import { DefaultException, NewCustomException } from 'src/common/exception/new-custom-exception';

@Injectable()
export class KHSAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    switch (context.getType().toString()) {
      case 'http':
        return context.switchToHttp().getRequest();
      case 'graphql':
        return GqlExecutionContext.create(context).getContext().req;
      default:
        throw new KHSException(KHSErrorCode.ERROR, 7830);
    }
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status: any,
  ): any {
    if (info instanceof TokenExpiredError) {
      if (context.getType().toString() === 'graphql') {
        throw new KHSException(
          KHSErrorCode.INVALID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw NewCustomException(DefaultException.TOKEN_EXPIRED)
      }
    }
    if (info instanceof JsonWebTokenError || !user) {
      if (context.getType().toString() === 'graphql') {
        throw new KHSException(
          KHSErrorCode.INVALID_TOKEN,
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw NewCustomException(DefaultException.INVALID_TOKEN)
      }
    }
    try {
      return super.handleRequest(err, user, info, context, status);
    } catch (error) {
      Logger.error(error);
      if (context.getType().toString() === 'graphql') {
        throw new KHSException(
          KHSErrorCode.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw NewCustomException(DefaultException.UNAUTHORIZED, user)
      }
    }
  }
}
