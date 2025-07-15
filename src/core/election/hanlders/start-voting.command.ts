import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';

export class StartVotingCommand {
  constructor(public electionId: string, public userId: string) {}
}

@CommandHandler(StartVotingCommand)
export class StartVotingHandler implements ICommandHandler<StartVotingCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId, userId }: StartVotingCommand) {
    const existedElection = await this.prisma.election.findFirst({
      where: { id: electionId, accountId: userId, isDeleted: false }
    });

    if (!existedElection) {
      throw new BadRequestException('Election not found or you do not have permission to start voting for this election.');
    }

    if (existedElection.status === 'Active') {
      throw new BadRequestException('Voting for this election is already active.');
    }

    await this.prisma.election.update({
      where: { id: electionId },
      data: { status: 'Active' }
    });

    return true;
  }
}
