import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';
import { getLastItem } from "../../../shared/utils/array.util";

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
        isUsed: false,
        isDeleted: false,
        election: {
          status: 'Active'
        }
      }
    });

    if (!existedCode) {
      throw new BadRequestException('Code is invalid or voting has been stopped.');
    }

    const candidates = await this.prisma.candidate.findMany({
      where: { electionId, isDeleted: false }
    });

    candidates.sort((a, b) => {
      const lastNameA = getLastItem(a.name?.split(' '));
      const lastNameB = getLastItem(b.name?.split(' '));
      return lastNameA.localeCompare(lastNameB, 'vi', { sensitivity: 'base' });
    });

    return candidates;
  }
}
