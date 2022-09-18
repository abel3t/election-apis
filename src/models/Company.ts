import { Field, ObjectType } from '@nestjs/graphql';

import { Cycle } from './Cycle';
import { Objective } from './Objective';
import { User } from './User';

@ObjectType({ description: 'Company' })
export class Company {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  logo: string;

  @Field()
  license: number;

  @Field(() => Cycle)
  cycle: Cycle;

  @Field(() => [Objective])
  objectives: Objective[];

  @Field(() => [User])
  users: User[];

  @Field()
  createdAt?: string;

  @Field({ nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  updatedAt?: string;

  @Field({ nullable: true })
  updatedBy?: number;
}
