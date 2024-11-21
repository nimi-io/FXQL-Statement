import { Module } from '@nestjs/common';
import { FxService } from './fx.service';
import { FxController } from './fx.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fx } from './entities/fx.entity';
import { FxRepository } from './fx.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Fx])],
  controllers: [FxController],
  providers: [FxService, FxRepository],
})
export class FxModule {}
