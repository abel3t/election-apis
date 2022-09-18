
require('dotenv').config();

interface IConfig {
  PORT: number;
  DB: {
    DATABASE_URL: string;
  };
  AWS: {
    ACCESS_KEY_ID: string;
    SECRET_ACCESS_KEY: string;
    REGION: string;
    COGNITO: {
      REGION: string;
      USER_POOL_ID: string;
      APP_CLIENT_ID: string;
    };
  };
}

export const AppConfig: IConfig = {
  PORT: +process.env.PORT || 8080,
  DB: {
    DATABASE_URL:
      process.env.DATABASE_URL ||
      'postgres://postgres:postgres@localhost:5432/postgres'
  },
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    REGION: process.env.AWS_REGION || '',
    COGNITO: {
      REGION: process.env.AWS_COGNITO_REGION,
      USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID,
      APP_CLIENT_ID: process.env.AWS_COGNITO_APP_CLIENT_ID
    }
  }
};
