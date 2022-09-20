import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';

export class GetElectionsQuery {
  constructor() {}
}

@QueryHandler(GetElectionsQuery)
export class GetElectionsHandler implements IQueryHandler<GetElectionsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  execute(query: GetElectionsQuery) {
    return this.prisma.election.findMany();
  }
}
