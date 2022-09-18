import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountResolver } from './account.resolver';


const QueryHandlers = [];
const CommandHandlers = [];

@Module({
  imports: [CqrsModule],
  providers: [AccountResolver, ...QueryHandlers, ...CommandHandlers]
})
export class AccountModule {}
