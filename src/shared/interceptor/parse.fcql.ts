import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import * as parser from '../../parser/parser';

export function ParseFXQL() {
  return Transform(({ value }) => {
    try {
      return parser.parse(value);
    } catch (error) {
      throw new BadRequestException(`Error parsing FXQL: ${error.message}`);
    }
  });
}
