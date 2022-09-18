import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Position' })
export class Position {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  level: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
