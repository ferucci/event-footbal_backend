import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readJSONFile } from 'src/utils/readJSONFile';
import { Repository } from 'typeorm';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) { }

  async seedPlayers() {
    const playersData = readJSONFile();

    if (!Array.isArray(playersData)) {
      throw new Error('Файл должен содержать массив игроков');
    }

    if (playersData.some(p => !p.name || !p.position)) {
      throw new Error('Некорректные данные игроков');
    }

    try {
      // Очищаем таблицу перед заполнением (опционально)
      await this.playerRepository.clear();

      // Создаем и сохраняем игроков
      const players = this.playerRepository.create(playersData);
      await this.playerRepository.save(players);

      console.log('База данных успешно заполнена!');
      return { message: 'База данных успешно заполнена!' };
    } catch (error) {
      console.error('Ошибка при заполнении базы данных:', error);
      throw error;
    }
  }
}