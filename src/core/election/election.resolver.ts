import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Account } from 'models/Account';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateElectionCommand, CreateElectionInput } from './hanlders/create-election.command';
import { CurrentUser, ICurrentUser } from 'decorators/user.decorator';
import { Election } from 'models/Election';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';
import { GetElectionsQuery } from './hanlders/get-elections.query';
import { Code } from '../../models/Code';
import { GenerateCodesCodeInput, GenerateCodesCommand } from './hanlders/code/generate-codes.command';
import { GetCodesQuery } from './hanlders/code/get-codes.query';
import { Candidate } from '../../models/Candidate';
import { GetCandidatesQuery } from './hanlders/candidate/get-candidates.command';
import { CreateCandidateCommand, CreateCandidateInput } from './hanlders/candidate/create-candidate.command';

@Resolver((_) => Election)
export class ElectionResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @UseGuards(AuthGuard)
  @Mutation((_) => Election)
  createElection(@Args('input') electionInput: CreateElectionInput, @CurrentUser() user: ICurrentUser) {
    return this.commandBus.execute(
      new CreateElectionCommand({ ...electionInput, userId: user.id })
    );
  }

  @UseGuards(AuthGuard)
  @Query((_) => [Election])
  async getElections(@CurrentUser() user: ICurrentUser): Promise<Election[]> {
    return this.queryBus.execute(new GetElectionsQuery());
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => [Code])
  generateCodes(@Args('input') generateCodesCodeInput: GenerateCodesCodeInput, @CurrentUser() user: ICurrentUser) {
    return this.commandBus.execute(
      new GenerateCodesCommand({ ...generateCodesCodeInput, userId: user.id })
    );
  }

  @UseGuards(AuthGuard)
  @Query((_) => [Code])
  async getCodes(@Args('electionId') electionId: string, @CurrentUser() user: ICurrentUser): Promise<Code[]> {
    return this.queryBus.execute(new GetCodesQuery(electionId));
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Candidate)
  createCandidate(@Args('input') candidateInput: CreateCandidateInput, @CurrentUser() user: ICurrentUser) {
    return this.commandBus.execute(
      new CreateCandidateCommand({ ...candidateInput, userId: user.id })
    );
  }

  @UseGuards(AuthGuard)
  @Query((_) => [Candidate])
  async getCandidates(@Args('electionId') electionId: string, @CurrentUser() user: ICurrentUser): Promise<Candidate[]> {
    return this.queryBus.execute(new GetCandidatesQuery(electionId));
  }
}