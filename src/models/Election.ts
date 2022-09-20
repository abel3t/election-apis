import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Election' })
export class Election {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
