import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1771350917798 implements MigrationInterface {
  name = ' $npmConfigName1771350917798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tags" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "createdAt"`);
  }
}
