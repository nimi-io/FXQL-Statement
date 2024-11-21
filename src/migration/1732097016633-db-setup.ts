import { MigrationInterface, QueryRunner } from "typeorm";

export class DbSetup1732097016633 implements MigrationInterface {
    name = 'DbSetup1732097016633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fx_rates" ("entry_id" SERIAL NOT NULL, "source_currency" "public"."fx_rates_source_currency_enum" NOT NULL, "destination_currency" "public"."fx_rates_destination_currency_enum" NOT NULL, "sell_price" numeric(15,4) NOT NULL, "buy_price" numeric(15,4) NOT NULL, "cap_amount" numeric(20,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_171578112af3d597acc473ba48a" PRIMARY KEY ("entry_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "fx_rates"`);
    }

}
