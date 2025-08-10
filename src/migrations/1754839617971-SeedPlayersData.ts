import * as fs from 'fs';
import * as path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPlayersData1630000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Проверяем существование таблицы
        const tableExists = await queryRunner.hasTable('player');
        if (!tableExists) {
            throw new Error('Table "player" does not exist');
        }

        // Читаем данные из JSON файла
        const playersData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../../data/initial-data.json'), 'utf-8')
        );

        // Вставляем данные
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('player')
            .values(playersData)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Откат - очищаем таблицу, но не удаляем её
        await queryRunner.query(`DELETE FROM player`);
    }
}