import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateElectionHandler } from './hanlders/create-election.command';
import { ElectionResolver } from './election.resolver';
import { GetElectionHandler } from './hanlders/get-elections.query';

const QueryHandlers = [GetElectionHandler];
const CommandHandlers = [CreateElectionHandler];

@Module({
  imports: [CqrsModule],
  providers: [ElectionResolver, ...QueryHandlers, ...CommandHandlers]
})
export class ElectionModule {}