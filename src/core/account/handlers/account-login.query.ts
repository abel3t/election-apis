import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  CognitoService,
  ICognitoTokenInfo,
  PrismaService
} from 'shared/services';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AccountLoginInput {
  @Field(() => String)
  email?: string;
  @Field(() => String)
  password: string;
}

export class AccountLoginQuery {
  constructor(public email: string, public password: string) {}
}

@QueryHandler(AccountLoginQuery)
export class AccountLoginHandler implements IQueryHandler<AccountLoginQuery> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cognitoService: CognitoService
  ) {}

  async execute({ email, password }) {
    const existedUser = await this.prisma.account.findUnique({ where: { email } });
    if (!existedUser) {
      throw new BadRequestException('User not found!');
    }

    return this.cognitoService
      .signIn(email, password)
      .then((result: ICognitoTokenInfo) => ({
        user: existedUser,
        ...result
      }))
      .catch((error) => {
        console.log(error);
        throw new BadRequestException(error?.message);
      });
  }
}
