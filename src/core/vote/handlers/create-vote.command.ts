import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Field, InputType } from '@nestjs/graphql';
import { PrismaService } from 'shared/services';
import { CheckCodeQuery } from './check-code.query';
import { BadRequestException } from '@nestjs/common';

@InputType()
export class CreateVoteInput {
  @Field(() => String)
  electionId: string;

  @Field(() => String)
  codeId: string;

  @Field(() => [String])
  candidateIds: string[];
}

interface ICreateVoteCommand {
  electionId: string;
  codeId: string;
  candidateIds: string[];
}

export class CreateVoteCommand {
  constructor(params: ICreateVoteCommand) {
    Object.assign(this, params);
  }

  public readonly electionId: string;
  public readonly codeId: string;
  public readonly candidateIds: string[];
}

@CommandHandler(CreateVoteCommand)
export class CreateVoteHandler
  implements ICommandHandler<CreateVoteCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBus: QueryBus
  ) {}

  async execute({ electionId, codeId, candidateIds }: CreateVoteCommand) {
    const { isValid } = await this.queryBus.execute(new CheckCodeQuery(electionId, codeId));

    if (!isValid) {
      throw new BadRequestException('Your code is invalid!');
    }

    const votes = candidateIds.map(candidateId => {
      return { electionId, codeId, candidateId };
    });

    await Promise.all([
      this.prisma.vote.createMany({ data: votes }),
      this.prisma.code.update({ data: { isUsed: true }, where: { id: codeId } })
    ]);

    return true;
  }
}