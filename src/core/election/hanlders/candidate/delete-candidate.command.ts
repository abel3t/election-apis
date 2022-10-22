import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';

export class DeleteCandidateCommand {
  constructor(public electionId: string, public candidateId: string) {}
}

@CommandHandler(DeleteCandidateCommand)
export class DeleteCandidateHandler
  implements ICommandHandler<DeleteCandidateCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId, candidateId }: DeleteCandidateCommand) {
    const existedCandidate = await this.prisma.candidate.findFirst({
      where: { id: candidateId, electionId }
    });

    if (!existedCandidate) {
      throw new BadRequestException('candidateId is invalid.');
    }

    await this.prisma.candidate.delete({ where: { id: candidateId } });

    return true;
  }
}
