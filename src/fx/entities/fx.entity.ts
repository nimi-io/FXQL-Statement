import { CURRENCY_CODE } from 'src/shared/enum/index.enum';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'fx_rates' })
export class Fx {
  @PrimaryGeneratedColumn({ name: 'entry_id', type: 'int' })
  entryId: number;

  @Column({
    name: 'source_currency',
    type: 'enum',
    enum: CURRENCY_CODE,
  })
  sourceCurrency: CURRENCY_CODE;

  @Column({
    name: 'destination_currency',
    type: 'enum',
    enum: CURRENCY_CODE,
  })
  destinationCurrency: CURRENCY_CODE;

  @Column({ name: 'sell_price', type: 'decimal', precision: 15, scale: 4 })
  sellPrice: number;

  @Column({ name: 'buy_price', type: 'decimal', precision: 15, scale: 4 })
  buyPrice: number;

  @Column({ name: 'cap_amount', type: 'decimal', precision: 20, scale: 2 })
  capAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
