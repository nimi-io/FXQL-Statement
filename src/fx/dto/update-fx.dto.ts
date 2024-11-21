import { PartialType } from '@nestjs/swagger';
import { CreateFxDto } from './create-fx.dto';

export class UpdateFxDto extends PartialType(CreateFxDto) {}
