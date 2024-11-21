import * as dotenv from 'dotenv';

dotenv.config();

export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  app_env: process.env.ENV || 'development',
  secretKey: process.env.SECRET_KEY || 'secret',
  secretKeyExp: process.env.SECRET_KEY_EXP || '24h',
  sentryDsn: process.env.SENTRY_DSN,
  tracesSampleRate: parseFloat(process.env.TRACES_SAMPLE_RATE) || 1.0,
  database: () => {
    switch (process.env.ENV) {
      case 'staging':
        return {
          type: 'postgres',
          host: process.env.STAGING_DB_DBHOST,
          port: parseInt(process.env.STAGING_DB_DBPORT),
          username: process.env.STAGING_DB_DBUSER,
          password: process.env.STAGING_DB_DBPASSWORD,
          database: process.env.STAGING_DB_DBNAME,
          synchronize: true,
          logging: true,
        };
      case 'production':
        return {
          type: 'postgres',
          host: process.env.PRODUCTION_DB_DBHOST,
          port: parseInt(process.env.PRODUCTION_DB_DBPORT),
          username: process.env.PRODUCTION_DB_DBUSER,
          password: process.env.PRODUCTION_DB_DBPASSWORD,
          database: process.env.PRODUCTION_DB_DBNAME,
          synchronize: false,
          logging: true,
        };
      default:
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5455,
          username: 'postgres',
          password: 'qwerty',
          database: 'fx',
          synchronize: true,
          logging: false,
          // autoLoadEntities: true,
          // entities: ['/*/**/*.entity{.ts,.js}'],
        };
    }
  },
});
