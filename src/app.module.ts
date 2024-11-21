import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbdatasource } from './shared/config/data.source';
import { FxModule } from './fx/fx.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SentryModule } from '@sentry/nestjs/setup';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbdatasource),
    SentryModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 3000, // 3 seconds
        limit: 2, // 2 request per 3 seconds
      },
    ]),
    FxModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
