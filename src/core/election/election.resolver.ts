import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'models/User';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateElectionCommand, CreateElectionInput } from './hanlders/create-election.command';
import { CurrentUser, ICurrentUser } from 'decorators/user.decorator';
import { Election } from 'models/Election';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'guards/auth.guard';
import { GetElectionQuery } from './hanlders/get-elections.query';

@Resolver((_) => User)
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
    return this.queryBus.execute(new GetElectionQuery());
  }
}