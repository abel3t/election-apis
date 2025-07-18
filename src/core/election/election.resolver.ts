import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateElectionCommand,
  CreateElectionInput
} from './hanlders/create-election.command';
import { CurrentUser, ICurrentUser } from 'decorators/user.decorator';
import { Election } from 'models/Election';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';
import { GetElectionsQuery } from './hanlders/get-elections.query';
import { Code } from '../../models/Code';
import {
  GenerateCodesCodeInput,
  GenerateCodesCommand
} from './hanlders/code/generate-codes.command';
import { GetCodesQuery } from './hanlders/code/get-codes.query';
import { Candidate } from '../../models/Candidate';
import { GetCandidatesQuery } from './hanlders/candidate/get-candidates.command';
import {
  CreateCandidateCommand,
  CreateCandidateInput
} from './hanlders/candidate/create-candidate.command';
import {
  UpdateCodeCommand,
  UpdateCodeInput
} from './hanlders/code/update-code.command';
import { CloneElectionCommand } from './hanlders/clone-election.command';
import { DeleteCandidateCommand } from './hanlders/candidate/delete-candidate.command';
import { UpdateElectionCommand } from './hanlders/update-election.comnmand';
import {
  GetElectionResultQuery,
  GetElectionResultResult
} from './hanlders/get-election-result.query';
import { GetElectionQuery } from './hanlders/get-election.query';
import { DeleteElectionCommand } from './hanlders/delete-election.command';
import { StopVotingCommand } from './hanlders/stop-voting.command';
import { StartVotingCommand } from './hanlders/start-voting.command';

@Resolver((_) => Election)
export class ElectionResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @UseGuards(AuthGuard)
  @Mutation((_) => Election)
  createElection(
    @Args('input') electionInput: CreateElectionInput,
    @CurrentUser() user: ICurrentUser
  ) {
    return this.commandBus.execute(
      new CreateElectionCommand({ ...electionInput, userId: user.id })
    );
  }

  @UseGuards(AuthGuard)
  @Query((_) => [Election])
  async getElections(@CurrentUser() user: ICurrentUser): Promise<Election[]> {
    return this.queryBus.execute(new GetElectionsQuery(user.id));
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => [Code])
  generateCodes(
    @Args('input') generateCodesCodeInput: GenerateCodesCodeInput,
    @CurrentUser() user: ICurrentUser
  ) {
    return this.commandBus.execute(
      new GenerateCodesCommand({ ...generateCodesCodeInput, userId: user.id })
    );
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Code)
  updateCode(
    @Args('input') updateCode: UpdateCodeInput,
    @CurrentUser() user: ICurrentUser
  ) {
    return this.commandBus.execute(new UpdateCodeCommand(updateCode));
  }

  @UseGuards(AuthGuard)
  @Query((_) => Election)
  async getElection(
    @Args('electionId') electionId: string,
    @CurrentUser() user: ICurrentUser
  ): Promise<Election> {
    return this.queryBus.execute(new GetElectionQuery(user.id, electionId));
  }

  @UseGuards(AuthGuard)
  @Query((_) => Boolean)
  async deleteElection(
    @Args('electionId') electionId: string,
    @CurrentUser() user: ICurrentUser
  ): Promise<Election> {
    return this.commandBus.execute(
      new DeleteElectionCommand(user.id, electionId)
    );
  }

  @UseGuards(AuthGuard)
  @Query((_) => [Code])
  async getCodes(
    @Args('electionId') electionId: string,
    @CurrentUser() user: ICurrentUser
  ): Promise<Code[]> {
    return this.queryBus.execute(new GetCodesQuery(electionId));
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Candidate)
  createCandidate(
    @Args('input') candidateInput: CreateCandidateInput,
    @CurrentUser() user: ICurrentUser
  ) {
    return this.commandBus.execute(
      new CreateCandidateCommand({ ...candidateInput, userId: user.id })
    );
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Boolean)
  async cloneElection(
    @Args('electionId') electionId: string,
    @CurrentUser() user: ICurrentUser
  ): Promise<Candidate> {
    return this.commandBus.execute(new CloneElectionCommand(electionId));
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Boolean)
  async deleteCandidate(
    @Args('electionId') electionId: string,
    @Args('candidateId') candidateId: string,
    @CurrentUser() user: ICurrentUser
  ): Promise<Candidate[]> {
    return this.commandBus.execute(
      new DeleteCandidateCommand(electionId, candidateId)
    );
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Boolean)
  async updateElection(
    @Args('electionId') electionId: string,
    @Args('name') name: string,
    @Args('maxSelected') maxSelected: number,
    @CurrentUser() user: ICurrentUser
  ): Promise<Candidate[]> {
    return this.commandBus.execute(
      new UpdateElectionCommand(electionId, name, maxSelected)
    );
  }

  @UseGuards(AuthGuard)
  @Query((_) => [Candidate])
  async getCandidates(
    @Args('electionId') electionId: string,
    @CurrentUser() user: ICurrentUser
  ): Promise<Candidate[]> {
    return this.queryBus.execute(new GetCandidatesQuery(electionId));
  }

  @UseGuards(AuthGuard)
  @Query((_) => [GetElectionResultResult])
  async getElectionResult(
    @Args('electionId') electionId: string,
    @CurrentUser() user: ICurrentUser
  ): Promise<Code[]> {
    return this.queryBus.execute(
      new GetElectionResultQuery(electionId, user.id)
    );
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Boolean)
  async stopVoting(
    @Args('electionId') electionId: string,
    @CurrentUser() user: ICurrentUser
  ): Promise<boolean> {
    return this.commandBus.execute(new StopVotingCommand(electionId, user.id));
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Boolean)
  async startVoting(
    @Args('electionId') electionId: string,
    @CurrentUser() user: ICurrentUser
  ): Promise<boolean> {
    return this.commandBus.execute(new StartVotingCommand(electionId, user.id));
  }
}
