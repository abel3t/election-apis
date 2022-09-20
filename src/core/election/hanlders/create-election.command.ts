import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Field, InputType } from '@nestjs/graphql';
import { PrismaService } from 'shared/services';

@InputType()
export class CreateElectionInput {
  @Field(() => String)
  name: string;
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
  public readonly userId: string;
}

@CommandHandler(CreateElectionCommand)
export class CreateElectionHandler
  implements ICommandHandler<CreateElectionCommand> {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async execute({ name, userId }: CreateElectionCommand) {
    const existedElection = await this.prisma.election.findFirst({ where: { name, account: { id: userId } } });

    if (existedElection) {
      throw new BadRequestException('Election is already exists!');
    }

    return this.prisma.election.create({ data: { name, account: { connect: { id: userId } } } });
  }
}