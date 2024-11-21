/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, HttpException, Logger } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { all } from 'axios';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CURRENCY_CODE, FXQL_ACTION } from 'src/shared/enum/index.enum';
import * as parser from '../../parser/parser';
import { ParseFXQL } from 'src/shared/interceptor/parse.fcql';

@ValidatorConstraint({ name: 'isValidFXQL', async: true })
export class IsValidFXQLConstraint implements ValidatorConstraintInterface {
  async validate(fxql: string, args: ValidationArguments) {
    try {
      const parsedResult = parser.parse(fxql);
      return parsedResult;
    } catch (error) {
      console.log(error.response);
      if (error.response?.statusCode) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
      throw new BadRequestException(
        `Error at line ${error.location.start.line}: ${error.message || error.response.message}`,
      );
    }
    // return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'FXQL string is not in a valid format or contains invalid currency codes, values, or structure.';
  }
}
export class CreateFxBulkDto {
  @ApiProperty({
    description: 'FXQL string containing multiple FXQL entries',
    example: `USD-GBP {
  BUY 0.85
  SELL 0.90
  CAP 10000
}

EUR-JPY {
  BUY 145.20
  SELL 146.50
  CAP 50000
}

NGN-USD {
  BUY 0.0022
  SELL 0.0023
  CAP 2000000
}`,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(IsValidFXQLConstraint)
  @MaxLength(4600) // @ParseFXQL()
  FXQL: any;
}
