import { Injectable } from '@nestjs/common';
import { CURRENCY_CODE, FXQL_ACTION } from 'src/shared/enum/index.enum';
import { FxRepository } from './fx.repository';
import { ParsedFxDto } from './dto/parsed.fx.dto';

@Injectable()
export class FxService {
  constructor(private readonly fxRepository: FxRepository) {}

  async create(createFxDto: ParsedFxDto[]) {
    const savedData = [];

    for (const val of createFxDto) {
      const parsed = {
        sourceCurrency: val.currencyPair.source as CURRENCY_CODE,
        destinationCurrency: val.currencyPair.destination as CURRENCY_CODE,
        buyPrice: val.actions.find(
          (action) => action.action === FXQL_ACTION.BUY,
        )?.value,
        sellPrice: val.actions.find(
          (action) => action.action === FXQL_ACTION.SELL,
        )?.value,
        capAmount: val.actions.find(
          (action) => action.action === FXQL_ACTION.CAP,
        )?.value,
      };

      if (
        parsed.buyPrice === undefined ||
        parsed.sellPrice === undefined ||
        parsed.capAmount === undefined
      ) {
        throw new Error('One or more actions are missing required values');
      }

      const checkIfExist = await this.fxRepository.findOne({
        where: {
          sourceCurrency: parsed.sourceCurrency,
          destinationCurrency: parsed.destinationCurrency,
        },
      });

      if (checkIfExist) {
        const updatedData = await this.fxRepository.updateWhere(
          {
            where: {
              sourceCurrency: parsed.sourceCurrency,
              destinationCurrency: parsed.destinationCurrency,
            },
          },
          { ...parsed },
        );
        savedData.push(updatedData);
      } else {
        const createdData = await this.fxRepository.create({ ...parsed });
        savedData.push(createdData);
      }
    }

    return savedData;
  }
}
