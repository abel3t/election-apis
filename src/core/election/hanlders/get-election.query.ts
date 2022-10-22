import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';

export class GetElectionQuery {
  constructor(public userId: string, public electionId: string) {}
}

@QueryHandler(GetElectionQuery)
export class GetElectionHandlerGetElectionHandler implements IQueryHandler<GetElectionQuery> {
  constructor(private readonly prisma: PrismaService) {}

  execute({ userId, electionId }: GetElectionQuery) {
    return this.prisma.election.findFirst({
      where: { id: electionId, accountId: userId }
    });
  }
}
