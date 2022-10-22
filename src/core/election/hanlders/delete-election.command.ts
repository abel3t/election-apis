import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';

export class DeleteElectionCommand {
  constructor(public userId: string, public electionId: string) {}
}

@CommandHandler(DeleteElectionCommand)
export class DeleteElectionHandler
  implements ICommandHandler<DeleteElectionCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, electionId }: DeleteElectionCommand) {
    const existedElection = await this.prisma.election.findFirst({
      where: { id: electionId, accountId: userId, isDeleted: false }
    });

    if (!existedElection) {
      throw new BadRequestException('Election is invalid.');
    }

    await this.prisma.election.update({
      where: { id: electionId },
      data: { isDeleted: true }
    });

    return true;
  }
}
