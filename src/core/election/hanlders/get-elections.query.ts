import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';

export class GetElectionsQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetElectionsQuery)
export class GetElectionsHandler implements IQueryHandler<GetElectionsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  execute({ userId }: GetElectionsQuery) {
    return this.prisma.election.findMany({ where: { accountId: userId }, orderBy: { createdAt: 'desc' }});
  }
}
