import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'models/User';

@ObjectType()
export class LoginResult {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => String)
  accessToken: string;
}
