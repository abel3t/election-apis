import { Field, InputType } from '@nestjs/graphql';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CognitoRefreshToken, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AppConfig } from '../../../shared/config';
import { BadRequestException } from '@nestjs/common';

@InputType()
export class RefreshTokenInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  refreshToken?: string;
}

export class RefreshTokenQuery {
  constructor(public email: string, public refreshToken: string) {}
}

@QueryHandler(RefreshTokenQuery)
export class RefreshTokenHandler implements IQueryHandler<RefreshTokenQuery> {
  private readonly userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: AppConfig.AWS.COGNITO.USER_POOL_ID,
      ClientId: AppConfig.AWS.COGNITO.APP_CLIENT_ID
    });

  }

  execute({ email, refreshToken }: RefreshTokenQuery) {
    const token = new CognitoRefreshToken({ RefreshToken: refreshToken });
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool
    });

    return new Promise((resolve, reject) =>
      cognitoUser.refreshSession(token, async (error, session) => {
        if (error) {
          console.log(error, refreshToken);
          return reject(
            new BadRequestException({
              ...error,
              code: 'INVALID_REFRESH_TOKEN'
            })
          );
        }

        resolve({
          email,
          token: session.idToken.jwtToken,
          accessToken: session.accessToken.jwtToken,
          refreshToken: session.refreshToken.token
        });
      })
    );

  }
}