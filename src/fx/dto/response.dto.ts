import { ApiProperty } from '@nestjs/swagger';

class FxEntryDto {
  @ApiProperty({ description: 'Unique ID of the FX entry', example: 1 })
  entryId: number;

  @ApiProperty({
    description: 'Source currency of the FX entry',
    example: 'USD',
  })
  sourceCurrency: string;

  @ApiProperty({
    description: 'Destination currency of the FX entry',
    example: 'GBP',
  })
  destinationCurrency: string;

  @ApiProperty({ description: 'Sell price for the FX entry', example: 0.955 })
  sellPrice: number;

  @ApiProperty({ description: 'Buy price for the FX entry', example: 0.8445 })
  buyPrice: number;

  @ApiProperty({ description: 'Cap amount for the FX entry', example: 0 })
  capAmount: number;

  @ApiProperty({
    description: 'Creation timestamp of the FX entry',
    example: '2024-11-20T21:26:03.431Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp of the FX entry',
    example: '2024-11-20T21:26:20.116Z',
  })
  updatedAt: string;
}

export class FxBulkResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message indicating the result of the request',
    example: 'Success',
  })
  message: string;

  @ApiProperty({
    description: 'Status code of the response',
    example: 'FXQL-200',
  })
  code: string;

  @ApiProperty({ description: 'Return status of the request', example: 'OK' })
  returnStatus: string;

  @ApiProperty({ type: [FxEntryDto], description: 'Array of FX entry data' })
  data: FxEntryDto[];
}
