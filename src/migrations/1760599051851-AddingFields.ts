import * as fs from 'fs';
import * as path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingFields1760599051851 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Проверяем существование таблицы
        const tableExists = await queryRunner.hasTable('player');
        if (!tableExists) {
            throw new Error('Table "player" does not exist');
        }

        // Читаем данные из JSON файла
        const playersDataPath = path.join(__dirname, '../../data/spartak-data.json');

        if (!fs.existsSync(playersDataPath)) {
            throw new Error(`File not found: ${playersDataPath}`);
        }

        const playersData = JSON.parse(
            fs.readFileSync(playersDataPath, 'utf-8')
        );

        console.log(`Found ${playersData.length} players to insert`);

        // Вставляем данные только если их еще нет в базе
        for (const player of playersData) {
            try {
                await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into('player')
                    .values(player)
                    .orIgnore() // Игнорировать дубликаты
                    .execute();

                console.log(`Inserted player: ${player.name || player.id}`);
            } catch (error) {
                console.warn(`Failed to insert player ${player.name || player.id}:`, error.message);
                // Продолжаем вставку остальных игроков
            }
        }

        console.log('Migration completed successfully');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ВНИМАНИЕ: Откат удалит ВСЕ данные из таблицы
        // Если хотите откатить только добавленные данные, нужно более сложное решение
        console.log('Warning: This will delete ALL players data');
        // await queryRunner.query(`DELETE FROM player`);

        // Лучше оставить пустым или реализовать более безопасный откат
        console.log('Down migration is not implemented for safety reasons');
    }
}
