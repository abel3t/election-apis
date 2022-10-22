import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountResolver } from './account.resolver';
import { GetProfileHandler } from './handlers/get-profile.query';
import { AccountLoginHandler } from './handlers/account-login.query';
import { CreateAdminAccountHandler } from './handlers/create-account.command';
import { RefreshTokenHandler } from './handlers/refresh-token.query';

const QueryHandlers = [
  GetProfileHandler,
  AccountLoginHandler,
  RefreshTokenHandler
];
const CommandHandlers = [CreateAdminAccountHandler];

@Module({
  imports: [CqrsModule],
  providers: [AccountResolver, ...QueryHandlers, ...CommandHandlers]
})
export class AccountModule {}
