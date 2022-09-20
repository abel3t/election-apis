import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { VoteResolver } from './vote.resolver';
import { CheckCodeHandler } from './handlers/check-code.query';
import { CreateVoteHandler } from './handlers/create-vote.command';

const QueryHandlers = [CheckCodeHandler];
const CommandHandlers = [CreateVoteHandler];

@Module({
  imports: [CqrsModule],
  providers: [VoteResolver, ...QueryHandlers, ...CommandHandlers]
})
export class VoteModule {}