import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Field, ObjectType } from '@nestjs/graphql';
import { PrismaService } from 'shared/services';

@ObjectType()
export class SignUpResult {
  @Field(() => String)
  email: string;

  @Field(() => String)
  role: string;
}

export class GetProfileQuery {
  constructor(public readonly email: string) {}
}

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {
  constructor(private readonly prisma: PrismaService) {}

  execute({ email }: GetProfileQuery) {
    return this.prisma.account.findUnique({ where: { email } });
  }
}
