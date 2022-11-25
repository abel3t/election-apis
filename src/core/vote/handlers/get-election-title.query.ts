import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from "graphql/type";

@ObjectType()
export class GetElectionTitleResult {
  @Field(() => GraphQLString)
  title: number;
}

export class GetElectionTitle {
  constructor(public readonly electionId: string) {}
}

@QueryHandler(GetElectionTitle)
export class GetElectionTitleHandler
  implements IQueryHandler<GetElectionTitle>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId }: GetElectionTitle) {
    const existedElection = await this.prisma.election.findFirst({ where: { id: electionId }});

    if (!existedElection) {
      throw new BadRequestException('election is invalid.');
    }

    return {
      title: existedElection.name
    }
  }
}
