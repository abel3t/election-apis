import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  logger = new Logger('AuthGuard');

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  handleRequest(error, user, info) {
    if (error) {
      throw new BadRequestException(error?.message);
    }
    if (!user) {
      throw new UnauthorizedException('could not authenticate with token');
    }

    return user;
  }
}
