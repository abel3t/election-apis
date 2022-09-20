import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';


export class GetElectionQuery {
  constructor() {}
}

@QueryHandler(GetElectionQuery)
export class GetElectionHandler implements IQueryHandler<GetElectionQuery> {
  constructor(private readonly prisma: PrismaService) {}

  execute(query: GetElectionQuery) {
    return this.prisma.election.findMany();
  }
}
