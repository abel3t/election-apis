import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Cycle' })
export class Cycle {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  companyId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
