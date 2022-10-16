import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Candidate' })
export class Candidate {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  imageUrl: string;

  @Field()
  electionId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
