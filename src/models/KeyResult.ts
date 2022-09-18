import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'KeyResult' })
export class KeyResult {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  progress: number;

  @Field()
  dueDate: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
