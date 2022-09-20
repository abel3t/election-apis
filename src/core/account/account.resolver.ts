import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'decorators/user.decorator';
import { AuthGuard } from 'guards/auth.guard';
import { Account } from 'models/Account';
import { LoginResult } from './dto/login-result.dto';
import { AccountLoginInput, AccountLoginQuery } from './handlers/account-login.query';
import { GetProfileQuery, SignUpResult } from './handlers/get-profile.query';
import { CreateAdminAccountCommand, CreateAdminAccountInput } from './handlers/create-account.command';
import { RefreshTokenInput, RefreshTokenQuery } from './handlers/refresh-token.query';


@Resolver((_) => Account)
export class AccountResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Mutation((_) => SignUpResult)
    createAccount(@Args('input') adminInput: CreateAdminAccountInput) {
    return this.commandBus.execute(
      new CreateAdminAccountCommand(adminInput)
    );
  }

  @Mutation((_) => LoginResult)
  login(@Args('input') loginUserInput: AccountLoginInput) {
    return this.queryBus.execute(
      new AccountLoginQuery(loginUserInput.email, loginUserInput.password)
    );
  }

  @Mutation((_) => LoginResult)
  refreshToken(@Args('input') refreshTokenInput: RefreshTokenInput) {
    return this.queryBus.execute(
      new RefreshTokenQuery(refreshTokenInput.email, refreshTokenInput.refreshToken)
    );
  }

  @UseGuards(AuthGuard)
  @Query((_) => Account)
  async getProfile(@CurrentUser() user: ICurrentUser): Promise<Account> {
    return this.queryBus.execute(new GetProfileQuery(user.email));
  }
}
