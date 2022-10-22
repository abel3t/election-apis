import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';

export class GetVotingCandidatesQuery {
  constructor(public readonly electionId: string, public readonly codeId) {}
}

@QueryHandler(GetVotingCandidatesQuery)
export class GetVotingCandidatesHandler
  implements IQueryHandler<GetVotingCandidatesQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId, codeId }: GetVotingCandidatesQuery) {
    const existedCode = await this.prisma.code.findFirst({
      where: {
        id: codeId,
        electionId,
        isActive: true,
        isUsed: false
      }
    });

    if (!existedCode) {
      throw new BadRequestException('Code is invalid.');
    }

    return this.prisma.candidate.findMany({ where: { electionId } });
  }
}
