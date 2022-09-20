import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'shared/config';

interface Payload {
  email: string;
  ['custom:id']: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const authConfig = {
      userPoolId: AppConfig.AWS.COGNITO.USER_POOL_ID,
      clientId: AppConfig.AWS.COGNITO.APP_CLIENT_ID,
      region: AppConfig.AWS.COGNITO.REGION,
      authority: `https://cognito-idp.${AppConfig.AWS.COGNITO.REGION}.amazonaws.com/${AppConfig.AWS.COGNITO.USER_POOL_ID}`
    };
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: authConfig.clientId,
      issuer: authConfig.authority,
      algorithms: ['RS256'],
      passReqToCallback: true
    });
  }

  public validate(request: never, payload: Payload) {
    return {
      email: payload.email,
      role: payload['custom:role'],
      id: payload['custom:id']
    };
  }
}
