import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'shared/services';
import { BadRequestException } from '@nestjs/common';
import { groupBy, keyBy, orderBy, uniqBy } from 'lodash';
import { Vote } from '../../../models/Vote';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Candidate } from 'models/Candidate';
import { GraphQLString } from 'graphql/type';

// Type for processed vote (removing code property and adding extracted fields)
type ProcessedVote = Omit<Vote, 'text' | 'updatedAt'> & { 
  codeId: string; 
  text: string;
};

@ObjectType()
export class GetElectionResultResult extends Candidate {
  @Field(() => [GraphQLString])
  codeIds: string[];

  @Field(() => [Vote])
  votes: Vote[]

  @Field(() => Int)
  totalVotes: number;

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
      this.prisma.vote.findMany({
        where: { electionId },
        include: { code: true }
      }),
      this.prisma.candidate.findMany({
        where: { electionId, isDeleted: false }
      })
    ]);

    const processedElectionVotes: ProcessedVote[] = electionVotes.map((electionVote) => ({
      id: electionVote.id,
      electionId: electionVote.electionId,
      candidateId: electionVote.candidateId,
      codeId: electionVote.code.id,
      text: electionVote.code?.text || '',
      createdAt: electionVote.createdAt
    }));

    const candidatesMapped: Record<string, Candidate> = keyBy(candidates, 'id');
    const votesGrouped = groupBy(processedElectionVotes, 'candidateId');
    const totalCodes = uniqBy(processedElectionVotes, 'codeId');

    const groupedVotes: GetElectionResultResult[] = Object.entries(
      votesGrouped
    ).map(([candidateId, votes]: [string, ProcessedVote[]]) => {
      // Convert ProcessedVote[] to Vote[] by adding the missing updatedAt property
      const votesAsVote: Vote[] = votes.map(vote => ({
        ...vote,
        updatedAt: new Date() // Add a default updatedAt since it's required by Vote type
      }));
      
      return {
        ...(candidatesMapped[candidateId] || {}),
        codeIds: votes.map((vote) => vote.codeId),
        votes: orderBy(votesAsVote, 'text', 'asc'),
        totalVotes: votes?.length || 0,
        totalCodes: totalCodes?.length || 0
      } as GetElectionResultResult;
    });

    return orderBy(groupedVotes, 'totalVotes', 'desc');
  }
}
