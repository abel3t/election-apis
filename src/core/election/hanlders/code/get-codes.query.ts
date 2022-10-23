import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';

export class GetCodesQuery {
  constructor(public readonly electionId: string) {}
}

@QueryHandler(GetCodesQuery)
export class GetCodesHandler implements IQueryHandler<GetCodesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  execute({ electionId }: GetCodesQuery) {
    return this.prisma.code.findMany({
      where: {
        election: { id: electionId, isDeleted: false },
        isDeleted: false
      },
      orderBy: { id: 'asc' }
    });
  }
}
