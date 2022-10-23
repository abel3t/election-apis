import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';
import { groupBy, keyBy, orderBy, uniqBy } from 'lodash';
import { Vote } from '../../../models/Vote';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Candidate } from 'models/Candidate';
import { GraphQLString } from 'graphql/type';

@ObjectType()
export class GetElectionResultResult extends Candidate {
  @Field(() => [GraphQLString])
  codeIds: string[];

  @Field(() => Int)
  votes: number;

  @Field(() => Int)
  totalCodes: number;
}

export class GetElectionResultQuery {
  constructor(public electionId: string, public accountId: string) {}
}

@QueryHandler(GetElectionResultQuery)
export class GetElectionResultHandler
  implements IQueryHandler<GetElectionResultQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ electionId, accountId }: GetElectionResultQuery) {
    const existedElection = await this.prisma.election.findFirst({
      where: { id: electionId, accountId, isDeleted: false }
    });

    if (!existedElection) {
      throw new BadRequestException('Election is invalid.');
    }

    const [electionVotes, candidates] = await Promise.all([
      this.prisma.vote.findMany({ where: { electionId } }),
      this.prisma.candidate.findMany({
        where: { electionId, isDeleted: false }
      })
    ]);

    const candidatesMapped: Record<string, Candidate> = keyBy(candidates, 'id');
    const votesGrouped = groupBy(electionVotes, 'candidateId');
    const totalCodes = uniqBy(electionVotes, 'codeId');

    const groupedVotes: GetElectionResultResult[] = Object.entries(
      votesGrouped
    ).map(([candidateId, votes]: [string, Vote[]]) => {
      return {
        ...(candidatesMapped[candidateId] || {}),
        codeIds: votes.map((vote) => vote.codeId),
        votes: votes?.length || 0,
        totalCodes: totalCodes?.length || 0
      } as GetElectionResultResult;
    });

    return orderBy(groupedVotes, 'votes', 'desc');
  }
}
