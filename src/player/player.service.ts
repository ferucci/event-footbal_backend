import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdateCardDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

import { MSG_ERROR } from 'src/utils/constants';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) { }

  async findAll(): Promise<Player[]> {
    return this.playerRepository.find();
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

  async create(createCardDto: CreatePlayerDto): Promise<Player> {
    const card = this.playerRepository.create(createCardDto);
    return this.playerRepository.save(card);
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Player | null> {
    // const card = await this.findOne(id);
    // this.playerRepository.merge(card, updateCardDto);
    // return this.playerRepository.save(card);
    return null;
  }

  async remove(id: number): Promise<void> {
    return;
    // const card = await this.findOne(id);
    // await this.playerRepository.remove(card);
  }

}