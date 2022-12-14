import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Code' })
export class Code {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field()
  downloaded: number;

  @Field()
  isUsed: boolean;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
