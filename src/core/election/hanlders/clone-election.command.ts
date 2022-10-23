import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';

export class CloneElectionCommand {
  constructor(public electionId: string) {}
}

@CommandHandler(CloneElectionCommand)
export class CloneElectionsHandler
  implements ICommandHandler<CloneElectionCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId }: CloneElectionCommand) {
    const existedElection = await this.prisma.election.findFirst({
      where: { id: electionId, isDeleted: false }
    });

    if (!existedElection) {
      throw new BadRequestException('electionId is invalid.');
    }

    const copiedElectionName = `Copy of ${existedElection.name}`;

    const newElection = await this.prisma.election.create({
      data: {
        name: copiedElectionName,
        account: { connect: { id: existedElection.accountId } }
      }
    });

    const existedCandidates = await this.prisma.candidate.findMany({
      where: {
        election: { id: electionId, isDeleted: false },
        isDeleted: false
      }
    });

    const newCandidates = existedCandidates.map((candidate) => ({
      name: candidate.name,
      imageUrl: candidate.imageUrl,
      electionId: newElection.id
    }));

    await this.prisma.candidate.createMany({
      data: newCandidates
    });

    return true;
  }
}
