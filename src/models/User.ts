import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'User' })
export class User {
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
