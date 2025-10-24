import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { ApiKeyInfo } from 'src/decorators/api-key-info.decorator';
import { TelegramService } from 'src/telegram/telegram.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { SelectedPlayerDto } from './dto/selected-player.dto';
import { UpdateCardDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
import { PlayerService } from './player.service';

@Controller('cards')
export class PlayerController {

  private selectionCounters: { [site: string]: number } = {
    spartak: 0,
    dinamo: 0
  };
  private lastResetDate: string = this.getCurrentDate();

  constructor(
    private readonly playerService: PlayerService,
    private readonly telegramService: TelegramService,
  ) { }

  private getCurrentDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  private checkAndResetCounter(): void {
    const today = this.getCurrentDate();
    if (today !== this.lastResetDate) {
      // Сбрасываем все счетчики
      Object.keys(this.selectionCounters).forEach(site => {
        this.selectionCounters[site] = 0;
      });
      this.lastResetDate = today;
    }
  }

  private incrementCounter(site: string): number {
    this.checkAndResetCounter();

    // Если сайта нет в счетчиках, добавляем его
    if (!this.selectionCounters[site]) {
      this.selectionCounters[site] = 0;
    }

    this.selectionCounters[site]++;
    return this.selectionCounters[site];
  }

  @Get()
  async findAll(@Query('site') site: string): Promise<Player[]> {
    return this.playerService.findAll(site);
  }

  @HttpCode(200)
  async sendToTelegram(
    @Param('id') id: string,
    @Body() cardData?: SelectedPlayerDto
  ): Promise<{ message: string }> {
    const card = await this.playerService.findOne(+id);
    const site = card?.site || 'Откуда ты взялся брат?)';

    const counter = this.incrementCounter(site);

    await this.telegramService.sendMessage(
      `
      Выбор #${counter} (${site})\n
      Был выбран Футболист "${card?.name}"!`,
    );
    return { message: 'Card information sent to Telegram successfully' };
  }

  @Post('selected')
  async handleSelectedCard(@Body() cardData: SelectedPlayerDto): Promise<{ status: string; cardId: number; }> {

    this.checkAndResetCounter();
    await this.sendToTelegram(String(cardData.id))
    await this.playerService.incrementClick(cardData.id);

    return { status: 'success', cardId: cardData.id };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Player | null> {
    return this.playerService.findOne(+id);
  }

  @Post()
  @UseGuards(ApiKeyGuard) // Защита метода создания
  async create(
    @Body() createCardDto: CreatePlayerDto,
    @ApiKeyInfo() apiKeyInfo: ApiKeyInfo // кастомный декоратор для типизации и проверки данных
  ): Promise<Player> {
    console.log(`Создание игрока с API ключем типа: ${apiKeyInfo.type}`);

    // Дополнительная проверка: можно ограничить создание игроков только для определенных ключей
    if (apiKeyInfo.key === 'unknown') {
      throw new UnauthorizedException('Данный API ключ не имеет прав на создание игроков');
    }

    return this.playerService.create(createCardDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<Player | null> {
    return this.playerService.update(+id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.playerService.remove(+id);
  }
}