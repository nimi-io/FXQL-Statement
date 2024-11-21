// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getRepository, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/shared/common/abstract/abstract';
import { Fx } from './entities/fx.entity';
export class FxRepository extends AbstractService<Fx> {
  constructor(
    @InjectRepository(Fx)
    private readonly Repository: Repository<Fx>,
  ) {
    super(Repository, Fx, Fx.name);
  }
}
