import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';

export class StopVotingCommand {
  constructor(public electionId: string, public userId: string) {}
}

@CommandHandler(StopVotingCommand)
export class StopVotingHandler implements ICommandHandler<StopVotingCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId, userId }: StopVotingCommand) {
    const existedElection = await this.prisma.election.findFirst({
      where: { id: electionId, accountId: userId, isDeleted: false }
    });

    if (!existedElection) {
      throw new BadRequestException('Election not found or you do not have permission to stop voting for this election.');
    }

    if (existedElection.status === 'Closed') {
      throw new BadRequestException('Voting for this election is already stopped.');
    }

    await this.prisma.election.update({
      where: { id: electionId },
      data: { status: 'Closed' }
    });

    return true;
  }
}
