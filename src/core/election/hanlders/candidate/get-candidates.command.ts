import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';

export class GetCandidatesQuery {
  constructor(public readonly electionId: string) {}
}

@QueryHandler(GetCandidatesQuery)
export class GetCandidatesHandler implements IQueryHandler<GetCandidatesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId }: GetCandidatesQuery) {
     const candidates = await this.prisma.candidate.findMany({
        where: {
          election: { id: electionId, isDeleted: false },
          isDeleted: false
        }
      });

     candidates.sort((a, b) => {
       return a.name?.split(' ').at(-1) > b.name?.split(' ').at(-1) ? 1 : -1;
     });

     return candidates;
  }
}
