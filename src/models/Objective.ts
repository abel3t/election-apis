import { Field, Float, ObjectType } from '@nestjs/graphql';

import { Company } from './Company';

export enum ObjectiveType {
  Committed,
  Aspirational
}

@ObjectType({ description: 'Objective' })
export class Objective {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  type: ObjectiveType;

  @Field(() => Float)
  progress: number;

  @Field()
  endDate: Date;

  @Field()
  companyId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
