import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdateCardDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

import { LOGS, MSG_ERROR } from 'src/utils/constants';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) { }

  async findAll(site: string): Promise<Player[]> {
    site = site.toLowerCase();

    return this.playerRepository.find({
      where: { site }
    });

  }

  async incrementClick(id: number): Promise<Player | null> {
    const player = await this.findOne(id);

    if (!player) return null;

    player.countClicks = (player.countClicks || 0) + 1;
    return this.playerRepository.save(player);
  }

  async findOne(id: number): Promise<Player | null> {
    try {
      return await this.playerRepository.findOne({ where: { id } });
    } catch (error) {
      throw new NotFoundException(MSG_ERROR.eget);
    }
  }

  async create(createCardDto: CreatePlayerDto): Promise<Player | null> {
    const existingCard = await this.playerRepository.findOne({
      where: {
        // проверяю на существование по имени:
        name: createCardDto.name
      }
    });

    if (existingCard) {
      console.log(MSG_ERROR.exsCard);
      return null;
    }
    const card = this.playerRepository.create(createCardDto);
    return this.playerRepository.save(card);
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Player | null> {
    console.log(LOGS.change_essence);
    return null;
  }

  async remove(id: number): Promise<void> {

    const card = await this.findOne(id);

    if (!card) return;

    try {
      await this.playerRepository.remove(card);
    } catch (error) {
      throw new NotFoundException(MSG_ERROR.edel);
    }

  }

}