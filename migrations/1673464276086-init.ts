import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1673464276086 implements MigrationInterface {
  name = 'init1673464276086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE public.ip (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      ip varchar NOT NULL,
      metadata varchar NOT NULL,
      CONSTRAINT "PK_b12fba291251bda71560e34b209" PRIMARY KEY (id)
    )`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3d99b154990d4f0b7fb5499829" ON public.ip USING btree (ip)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.ip`);
  }
}
