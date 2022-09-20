import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Account' })
export class Account {
  @Field()
  id: number;

  @Field()
  firstName?: string;

  @Field()
  lastName?: string;

  @Field()
  email: string;

  @Field()
  role: string;
}
