import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    switch (host.getType() || 'graphql') {
      case 'graphql': {
        return exception;
      }

      default: {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<FastifyReply>();
        const status = exception.getStatus();
        return res.status(status).send({
          ...exception
        });
      }
    }
  }
}
