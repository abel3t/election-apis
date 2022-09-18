import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'decorators/user.decorator';
import { AuthGuard } from 'guards/auth.guard';
import { User } from 'models/User';
import { LoginResult } from './dto/login-result.dto';
import { AccountLoginInput, AccountLoginQuery } from './handlers/account-login.query';
import { GetProfileQuery } from './handlers/get-profile.query';


@Resolver((_) => User)
export class AccountResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Mutation((_) => LoginResult)
  login(@Args('input') loginUserInput: AccountLoginInput) {
    return this.queryBus.execute(
      new AccountLoginQuery(loginUserInput.email, loginUserInput.password)
    );
  }

  @UseGuards(AuthGuard)
  @Query((_) => User)
  async getProfile(@CurrentUser() user: ICurrentUser): Promise<User> {
    return this.queryBus.execute(new GetProfileQuery(user.email));
  }
}
