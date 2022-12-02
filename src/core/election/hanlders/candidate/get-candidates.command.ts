import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { getLastItem } from "../../../../shared/utils/array.util";

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
       return getLastItem(a.name?.split(' ')) > getLastItem(b.name?.split(' ')) ? 1 : -1;
     });

     return candidates;
  }
}
