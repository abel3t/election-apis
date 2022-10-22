import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Field, InputType, Int } from '@nestjs/graphql';
import { PrismaService } from 'shared/services';
import { GraphQLString } from 'graphql/type';

@InputType()
export class CreateElectionInput {
  @Field(() => GraphQLString)
  name: string;

  @Field(() => Int)
  maxSelected: number;
}

interface ICreateElectionCommand {
  name: string;
  userId: string;
}

export class CreateElectionCommand {
  constructor(params: ICreateElectionCommand) {
    Object.assign(this, params);
  }

  public readonly name: string;
  public readonly maxSelected: number;
  public readonly userId: string;
}

@CommandHandler(CreateElectionCommand)
export class CreateElectionHandler
  implements ICommandHandler<CreateElectionCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ name, maxSelected, userId }: CreateElectionCommand) {
    const existedElection = await this.prisma.election.findFirst({
      where: { name, account: { id: userId }, isDeleted: false }
    });

    if (existedElection) {
      throw new BadRequestException('Election is already exists!');
    }

    return this.prisma.election.create({
      data: { name, maxSelected, account: { connect: { id: userId } } }
    });
  }
}
