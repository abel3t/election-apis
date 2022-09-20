import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { SharedModule } from 'shared/shared.module';

import { JwtStrategy } from './strategies/passport.jwt.strategy';
import { AccountModule } from './core/account/account.module';
import { ElectionModule } from './core/election/election.module';
import { VoteModule } from './core/vote/vote.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'src/graphql/schema.gql',
      sortSchema: true
    }),
    SharedModule,
    AccountModule,
    ElectionModule,
    VoteModule
  ],
  controllers: [],
  providers: [JwtStrategy]
})
export class AppModule {}
