import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from 'models/Account';

@ObjectType()
export class LoginResult {
  @Field(() => Account)
  user: Account;

  @Field(() => String)
  token: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => String)
  accessToken: string;
}
