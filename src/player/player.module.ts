import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentLogService } from 'src/consent-log/consent-log.service';
import { ConsentLog } from 'src/consent-log/entities/consent-log.entity';
import { TelegramModule } from 'src/telegram/telegram.module';
import { Player } from './entities/player.entity';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player, ConsentLog]), TelegramModule],
  controllers: [PlayerController],
  providers: [PlayerService, ConsentLogService],
})
export class CardModule { }