import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { AuthenticationError } from 'apollo-server-fastify';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  logger = new Logger('AuthGuard');

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new AuthenticationError('could not authenticate with token');
    }

    return user;
  }
}
