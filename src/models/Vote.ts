import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Vote' })
export class Vote {
  @Field()
  id: string;

  @Field()
  electionId: string;

  @Field()
  candidateId: string;

  @Field()
  codeId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
