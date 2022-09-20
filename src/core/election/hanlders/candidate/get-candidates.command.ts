import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';

export class GetCandidatesQuery {
  constructor(public readonly electionId: string) {}
}

@QueryHandler(GetCandidatesQuery)
export class GetCandidatesHandler implements IQueryHandler<GetCandidatesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  execute({ electionId }: GetCandidatesQuery) {
    return this.prisma.candidate.findMany({ where: { election: { id: electionId } }});
  }
}
