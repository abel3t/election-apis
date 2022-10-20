import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Election' })
export class Election {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  status: string;

  @Field()
  maxSelected: number;

  @Field()
  accountId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
