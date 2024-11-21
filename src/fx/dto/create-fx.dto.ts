import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { CURRENCY_CODE } from 'src/shared/enum/index.enum';

export class CreateFxDto {
  @ApiProperty({
    description: 'Source currency code (e.g., USD)',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  @IsNotEmpty()
  @IsEnum(CURRENCY_CODE)
  sourceCurrency: CURRENCY_CODE;

  @ApiProperty({
    description: 'Destination currency code (e.g., GBP)',
    example: 'GBP',
  })
  @IsString()
  @IsNotEmpty()
  @IsNotEmpty()
  @IsEnum(CURRENCY_CODE)
  destinationCurrency: CURRENCY_CODE;

  @ApiProperty({
    description: 'Buy price',
    example: 100.0,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  buyPrice: number;

  @ApiProperty({
    description: 'Sell price',
    example: 200.0,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  sellPrice: number;

  @ApiProperty({
    description: 'Cap amount',
    example: 93800.0,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  capAmount: number;
}
