import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertPlayersData1772212350827 implements MigrationInterface {
    name = 'InsertPlayersData1772212350827';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Проверяем существование таблицы player
        const tableExists = await queryRunner.hasTable('player');

        if (!tableExists) {
            // Создаём таблицу с правильными именами столбцов
            await queryRunner.query(`
                CREATE TABLE "player" (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    number VARCHAR(10) NOT NULL,
                    height VARCHAR(20),
                    weight VARCHAR(20),
                    position VARCHAR(50) NOT NULL,
                    rate INTEGER DEFAULT NULL,
                    country_flag_url VARCHAR(255) NOT NULL,
                    player_image_url VARCHAR(255) NOT NULL,
                    site VARCHAR(20) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    "countClicks" INTEGER DEFAULT 0
                )
            `);
            console.log('Table "player" created successfully');
        }

        // Очищаем таблицу перед вставкой (чтобы избежать конфликтов)
        await queryRunner.query(`TRUNCATE TABLE "player" RESTART IDENTITY CASCADE`);

        // Вставляем данные
        const players = [
            { id: 1, name: 'Лунёв', number: '01', height: '190 см', weight: '82 кг', position: 'Вратарь', rate: 85, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/01-Лунев.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 13 },
            { id: 2, name: 'Битело', number: '10', height: '190 см', weight: '70 кг', position: 'Полузащитник', rate: 81, country_flag_url: './images/flags/brazil.png', site: 'dinamo', player_image_url: './images/players/10-М.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 40 },
            { id: 3, name: 'Майсторович', number: '05', height: '185 см', weight: '77 кг', position: 'Защитник', rate: 65, country_flag_url: './images/flags/serbia.png', site: 'dinamo', player_image_url: './images/players/05-Майсторович.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 2 },
            { id: 4, name: 'Фернандес', number: '06', height: '188 см', weight: '89 кг', position: 'Защитник', rate: 82, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/06-Фернандес.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 2 },
            { id: 5, name: 'Скопинцев', number: '07', height: '177 см', weight: '69 кг', position: 'Защитник', rate: 84, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/07-Скопинцев.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 6 },
            { id: 6, name: 'Гомес', number: '11', height: '175 см', weight: '73 кг', position: 'Нападающий', rate: 87, country_flag_url: './images/flags/brazil.png', site: 'dinamo', player_image_url: './images/players/11-Гомес.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 2 },
            { id: 7, name: 'Нгамалё', number: '13', height: '181 см', weight: '75 кг', position: 'Нападающий', rate: 88, country_flag_url: './images/flags/cameroun.png', site: 'dinamo', player_image_url: './images/players/13-Нгамале.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 15 },
            { id: 8, name: 'Маухуб', number: '14', height: '186 см', weight: '75 кг', position: 'Нападающий', rate: 75, country_flag_url: './images/flags/marocco.png', site: 'dinamo', player_image_url: './images/players/14-Маухуб.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 3 },
            { id: 9, name: 'Маричаль', number: '18', height: '185 см', weight: '76 кг', position: 'Защитник', rate: 79, country_flag_url: './images/flags/uruguay.png', site: 'dinamo', player_image_url: './images/players/18-Маричаль.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 1 },
            { id: 10, name: 'Александров', number: '30', height: '195 см', weight: '83 кг', position: 'Полузащитник', rate: 78, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/30-Александров.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 0 },
            { id: 11, name: 'Лещук', number: '31', height: '188 см', weight: '81 кг', position: 'Вратарь', rate: 76, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/31-Лещук.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 2 },
            { id: 12, name: 'Расулов', number: '40', height: '179 см', weight: '74 кг', position: 'Вратарь', rate: 68, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/40-Расулов.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 10 },
            { id: 13, name: 'Кудравец', number: '47', height: '191 см', weight: '88 кг', position: 'Вратарь', rate: 79, country_flag_url: './images/flags/belorusi.png', site: 'dinamo', player_image_url: './images/players/47-Кудравец.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 2 },
            { id: 14, name: 'Кутицкий', number: '50', height: '184 см', weight: '71 кг', position: 'Полузащитник', rate: 77, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/50-Кутицкий.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 0 },
            { id: 15, name: 'Чавес', number: '24', height: '178 см', weight: '73 кг', position: 'Нападающий', rate: 79, country_flag_url: './images/flags/mexica.png', site: 'dinamo', player_image_url: './images/players/24-Луис.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 4 },
            { id: 16, name: 'Смелов', number: '52', height: '177 см', weight: '66 кг', position: 'Полузащитник', rate: 69, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/52-Смелов.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 1 },
            { id: 17, name: 'Боков', number: '69', height: '182 см', weight: '75 кг', position: 'Нападающий', rate: 80, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/69-Боков.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 1 },
            { id: 18, name: 'Тюкавин', number: '70', height: '180 см', weight: '80 кг', position: 'Нападающий', rate: 90, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/70-Тюкавин.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 106 },
            { id: 19, name: 'Фомин', number: '74', height: '187 см', weight: '77 кг', position: 'Полузащитник', rate: 76, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/74-Фомин.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 5 },
            { id: 20, name: 'Рикардо', number: '57', height: '189 см', weight: '87 кг', position: 'Защитник', rate: 78, country_flag_url: './images/flags/brazil.png', site: 'dinamo', player_image_url: './images/players/57-Рикардо.png', created_at: '2026-02-27 10:35:43.647386', countClicks: 0 },
            { id: 21, name: 'Глебов', number: '15', height: '177 см', weight: '72 кг', position: 'Полузащитник', rate: 86, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/15-Глебов.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 7 },
            { id: 22, name: 'Окишор', number: '88', height: '185 см', weight: '68 кг', position: 'Полузащитник', rate: 65, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/88-Окишор.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 3 },
            { id: 23, name: 'Гладышев', number: '91', height: '181 см', weight: '74 кг', position: 'Нападающий', rate: 77, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/91-Гладышев.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 4 },
            { id: 25, name: 'Балаханов', number: '79', height: '177 см', weight: '64 кг', position: 'Защитник', rate: null, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/79-Балаханов.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 0 },
            { id: 26, name: 'Бабаев', number: '17', height: '172 см', weight: '72 кг', position: 'Нападающий', rate: null, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/17-Бабаев.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 6 },
            { id: 27, name: 'Гагнидзе', number: '34', height: '175 см', weight: '68 кг', position: 'Полузащитник', rate: null, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/34-Гагнидзе.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 2 },
            { id: 28, name: 'Зайдензаль', number: '56', height: '188 см', weight: '83 кг', position: 'Защитник', rate: null, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/56-Зайдензаль.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 0 },
            { id: 29, name: 'Зайнутдинов', number: '19', height: '183 см', weight: '73 кг', position: 'Защитник', rate: null, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/19-Зайнутдинов.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 1 },
            { id: 30, name: 'Касерес', number: '04', height: '177 см', weight: '73 кг', position: 'Защитник', rate: 83, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/04-Касерес.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 3 },
            { id: 31, name: 'Осипенко', number: '55', height: '193 см', weight: '83 кг', position: 'Защитник', rate: 83, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/55-Осипенко.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 8 },
            { id: 32, name: 'Рубенс', number: '44', height: '178 см', weight: '68 кг', position: 'Полузащитник', rate: null, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/44-Рубенс.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 3 },
            { id: 33, name: 'Сергеев', number: '33', height: '184 см', weight: '83 кг', position: 'Нападающий', rate: null, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/33-Сергеев.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 19 },
            { id: 34, name: 'Хубулов', number: '61', height: '181 см', weight: '82 кг', position: 'Нападающий', rate: null, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/61-Хубулов.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 1 },
            { id: 35, name: 'Миранчук', number: '21', height: '185 см', weight: '81 кг', position: 'Полузащитник', rate: 87, country_flag_url: './images/flags/russia.png', site: 'dinamo', player_image_url: './images/players/21-Миранчук.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 26 },
            { id: 41, name: 'Игорь Дмитриев', number: '27', height: '182 см', weight: '0', position: 'пз', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Дмитриев.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 15 },
            { id: 44, name: 'Даниил Зорин', number: '28', height: '180 см', weight: '0', position: 'пз', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Зорин.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 9 },
            { id: 40, name: 'Даниил Денисов', number: '97', height: '187 см', weight: '0', position: 'зщ', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Денисов.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 6 },
            { id: 45, name: 'Руслан Литвинов', number: '68', height: '184 см', weight: '0', position: 'зщ', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Литвинов.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 25 },
            { id: 42, name: 'Александр Довбня', number: '56', height: '194 см', weight: '0', position: 'гк', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Довбня.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 5 },
            { id: 43, name: 'Антон Заболотный', number: '91', height: '191 см', weight: '0', position: 'нап', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Заболотный.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 14 },
            { id: 39, name: 'Егор Гузиев', number: '88', height: '186 см', weight: '0', position: 'зщ', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Гузиев.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 2 },
            { id: 36, name: 'Срджан Бабич', number: '06', height: '194 см', weight: '0', position: 'зщ', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Бабич.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 20 },
            { id: 46, name: 'Александр Максименко', number: '98', height: '187 см', weight: '0', position: 'гк', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Максименко.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 60 },
            { id: 59, name: 'Манфред Угальде', number: '9', height: '173 см', weight: '0', position: 'нап', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Угальде.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 69 },
            { id: 55, name: 'Наиль Умяров', number: '18', height: '182 см', weight: '0', position: 'пз', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Умяров.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 33 },
            { id: 37, name: 'Эсекьель Барко', number: '05', height: '167 см', weight: '0', position: 'пз', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Барко.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 115 },
            { id: 48, name: 'Коста Маркиньос', number: '10', height: '165 см', weight: '0', position: 'пз', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Маркиньос.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 57 },
            { id: 50, name: 'Тео Бонгонда', number: '77', height: '177 см', weight: '0', position: 'пз', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Бонгонда.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 8 },
            { id: 56, name: 'Даниил Хлусевич', number: '82', height: '186 см', weight: '0', position: 'зщ', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Хлусевич.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 2 },
            { id: 63, name: 'Карраскаль', number: '15', height: '180 см', weight: '72 кг', position: 'Полузащитник', rate: 85, country_flag_url: './images/flags/columbia.png', site: 'dinamo', player_image_url: './images/players/08-Карраскаль.png', created_at: '2025-11-26 12:37:31.058352', countClicks: 3 },
            { id: 53, name: 'Олег Рябчук', number: '02', height: '177 см', weight: '0', position: 'зщ', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Рябчук.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 3 },
            { id: 57, name: 'Александр Джику', number: '4', height: '182 см', weight: '0', position: 'зщ', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Джику.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 1 },
            { id: 47, name: 'Кристофер Ву', number: '3', height: '191 см', weight: '0', position: 'зщ', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Ву.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 20 },
            { id: 49, name: 'Никита Массалыга', number: '24', height: '187 см', weight: '0', position: 'пз', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Массалыга.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 4 },
            { id: 52, name: 'Кристофер Мартинс', number: '35', height: '188 см', weight: '0', position: 'пз', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Мартинс.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 13 },
            { id: 61, name: 'Роман Зобнин', number: '47', height: '182 см', weight: '80 кг', position: 'Полузащитник', rate: 84, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Зобнин.png', created_at: '2025-11-01 10:51:59.561567', countClicks: 47 },
            { id: 58, name: 'Илья Самошников', number: '14', height: '177 см', weight: '0', position: 'зщ', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Самошников.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 4 },
            { id: 54, name: 'Пабло Солари', number: '07', height: '178 см', weight: '0', position: 'пз', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Солари.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 27 },
            { id: 38, name: 'Ливай Гарсия', number: '11', height: '181 см', weight: '0', position: 'нап', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Гарсия.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 9 },
            { id: 51, name: 'Илья Помазун', number: '01', height: '195 см', weight: '0', position: 'гк', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Помазун.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 2 },
            { id: 60, name: 'Жедсон Фернандеш', number: '83', height: '180 см', weight: '0', position: 'пз', rate: 0, country_flag_url: 'default', site: 'spartak', player_image_url: './images/players-spartak/Фернандеш.png', created_at: '2025-10-24 10:35:43.647386', countClicks: 51 },
        ];

        // Вставляем данные батчами по 50 записей для производительности
        const batchSize = 50;
        for (let i = 0; i < players.length; i += batchSize) {
            const batch = players.slice(i, i + batchSize);

            // Строим запрос для батча
            const values: string[] = [];
            const params: any[] = [];
            let paramIndex = 1;

            for (const player of batch) {
                values.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4}, $${paramIndex + 5}, $${paramIndex + 6}, $${paramIndex + 7}, $${paramIndex + 8}, $${paramIndex + 9}, $${paramIndex + 10}, $${paramIndex + 11})`);
                params.push(
                    player.id,
                    player.name,
                    player.number,
                    player.height,
                    player.weight,
                    player.position,
                    player.rate,
                    player.country_flag_url,
                    player.site,
                    player.player_image_url,
                    player.created_at,
                    player.countClicks
                );
                paramIndex += 12;
            }

            const query = `
                INSERT INTO "player" (
                    id, name, number, height, weight, position, rate,
                    country_flag_url, site, player_image_url, created_at, "countClicks"
                ) VALUES ${values.join(', ')}
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    number = EXCLUDED.number,
                    height = EXCLUDED.height,
                    weight = EXCLUDED.weight,
                    position = EXCLUDED.position,
                    rate = EXCLUDED.rate,
                    country_flag_url = EXCLUDED.country_flag_url,
                    site = EXCLUDED.site,
                    player_image_url = EXCLUDED.player_image_url,
                    created_at = EXCLUDED.created_at,
                    "countClicks" = EXCLUDED."countClicks"
            `;

            await queryRunner.query(query, params);
        }

        console.log(`Successfully inserted/updated ${players.length} players`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // При откате удаляем только данные, но оставляем таблицу
        await queryRunner.query(`TRUNCATE TABLE "player" RESTART IDENTITY CASCADE`);
    }
}