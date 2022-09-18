import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Unit' })
export class Unit {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  shortName: string;

  @Field()
  order: number;

  @Field()
  createdAt: Date;

  @Field()
  createdBy: number;

  @Field()
  updatedAt: Date;

  @Field()
  updatedBy: number;
}
