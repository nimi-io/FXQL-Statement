import { Test, TestingModule } from '@nestjs/testing';
import { FxService } from './fx.service';
import { CreateFxBulkDto } from './dto/create-fx-bulk.dto';

describe('FxService', () => {
  let service: FxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FxService],
    }).compile();

    service = module.get<FxService>(FxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should parse valid FXQL strings into entries when FXQL is well-formed', () => {
    const createFxDto = new CreateFxBulkDto();
    createFxDto.FXQL = `USD-GBP {
        BUY 0.85
        SELL 0.90
        CAP 10000
      }`;

    const result = service.create(createFxDto);

    expect(result).toEqual([
      {
        sourceCurrency: 'USD',
        destinationCurrency: 'GBP',
        buyPrice: 0.85,
        sellPrice: 0.9,
        capAmount: 10000,
      },
    ]);
  });
});
