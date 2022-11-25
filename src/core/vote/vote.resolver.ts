import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUser, ICurrentUser } from 'decorators/user.decorator';
import {
  CheckCodeInput,
  CheckCodeQuery,
  CheckCodeResult
} from './handlers/check-code.query';
import {
  CreateVoteCommand,
  CreateVoteInput
} from './handlers/create-vote.command';
import { GetVotingCandidatesQuery } from './handlers/get-candidates.query';
import { Vote } from 'models/Vote';
import { Candidate } from 'models/Candidate';
import {
  GetMaxSelectedCandidate,
  GetMaxSelectedCandidateResult
} from './handlers/get-max-selected-candidate.query';
import { GetElectionTitle, GetElectionTitleResult } from "./handlers/get-election-title.query";

@Resolver((_) => Vote)
export class VoteResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Query((_) => CheckCodeResult)
  async checkCode(
    @Args('input') { electionId, codeId }: CheckCodeInput,
    @CurrentUser() user: ICurrentUser
  ): Promise<CheckCodeResult> {
    return this.queryBus.execute(new CheckCodeQuery(electionId, codeId));
  }

  @Mutation((_) => Boolean)
  async createVotes(@Args('input') createVoteInput: CreateVoteInput) {
    return this.commandBus.execute(new CreateVoteCommand(createVoteInput));
  }

  @Query((_) => [Candidate])
  async getVotingCandidates(
    @Args('electionId') electionId: string,
    @Args('codeId') codeId: string
  ) {
    return this.queryBus.execute(
      new GetVotingCandidatesQuery(electionId, codeId)
    );
  }

  @Query((_) => GetMaxSelectedCandidateResult)
  async getMaxSelectedCandidate(
    @Args('electionId') electionId: string,
    @Args('codeId') codeId: string
  ) {
    return this.queryBus.execute(
      new GetMaxSelectedCandidate(electionId, codeId)
    );
  }


  @Query((_) => GetElectionTitleResult)
  async getElectionTitle(
    @Args('electionId') electionId: string
  ) {
    return this.queryBus.execute(
      new GetElectionTitle(electionId)
    );
  }
}
