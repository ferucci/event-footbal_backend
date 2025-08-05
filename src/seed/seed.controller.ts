import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

// Заполняет данными из файла: frontend/src/data/players.json 
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Get('players')
  async seedPlayers() {
    return this.seedService.seedPlayers();
  }
}