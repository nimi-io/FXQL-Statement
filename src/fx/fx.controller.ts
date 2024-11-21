import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { FxService } from './fx.service';
import { CreateFxBulkDto } from './dto/create-fx-bulk.dto';
import { IsPublic } from 'src/shared/decorators/public-request.decorator';
import * as parser from '../parser/parser';
import { ApiResponse } from '@nestjs/swagger';
import { FxBulkResponseDto } from './dto/response.dto';

@IsPublic()
@Controller('fx')
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'The list of FX bulk entries was successfully retrieved.',
    type: FxBulkResponseDto,
  })
  create(@Body() createFxDto: CreateFxBulkDto) {
    try {
      const parsedResult = parser.parse(createFxDto.FXQL);
      return this.fxService.create(parsedResult);
    } catch (error) {
      throw new BadRequestException(
        `Error at line ${error.location.start.line}: ${error.message}`,
      );
    }
  }
}
