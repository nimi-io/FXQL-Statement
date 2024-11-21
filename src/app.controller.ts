import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './shared/decorators/public-request.decorator';

@IsPublic()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return this.appService.health();
  }

  @Get('/debug-sentry')
  getError() {
    throw new Error('err log');
  }
}
