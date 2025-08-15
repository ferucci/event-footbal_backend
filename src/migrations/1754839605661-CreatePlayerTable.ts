import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlayerTable1630000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "player" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "number" character varying(10) NOT NULL,
                "height" character varying(20),
                "weight" character varying(20),
                "position" character varying(50) NOT NULL,
                "rate" integer,
                "country_flag_url" character varying(255) NOT NULL,
                "player_image_url" character varying(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "countClicks" integer NOT NULL DEFAULT 0,
                CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "player"`);
    }
}