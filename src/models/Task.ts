import { Field, Int, ObjectType } from '@nestjs/graphql';

export enum TaskStatus {
  Todo,
  InProgress,
  Done,
}

@ObjectType({ description: 'Task' })
export class Task {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  status: TaskStatus;

  @Field()
  dueDate: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
