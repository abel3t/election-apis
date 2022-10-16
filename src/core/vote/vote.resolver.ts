import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser, ICurrentUser } from 'decorators/user.decorator';
import { CheckCodeInput, CheckCodeQuery, CheckCodeResult } from './handlers/check-code.query';
import { CreateVoteCommand, CreateVoteInput } from './handlers/create-vote.command';
import { GetVotingCandidatesQuery } from './handlers/get-candidates.query';
import { Vote } from 'models/Vote';
import { Candidate } from 'models/Candidate';

@Resolver((_) => Vote)
export class VoteResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @UseGuards(AuthGuard)
  @Query((_) => CheckCodeResult)
  async checkCode(@Args('input') { electionId, codeId }: CheckCodeInput,
    @CurrentUser() user: ICurrentUser): Promise<CheckCodeResult> {
    return this.queryBus.execute(new CheckCodeQuery(electionId, codeId));
  }

  @Mutation((_) => Boolean)
  async createVotes(@Args('input') createVoteInput: CreateVoteInput) {
    return this.commandBus.execute(new CreateVoteCommand(createVoteInput));
  }

  @Query((_) => [Candidate])
  async getCandidates(@Args('electionId') electionId: string, @Args('codeId') codeId: string) {
    return this.queryBus.execute(new GetVotingCandidatesQuery(electionId, codeId));
  }
}