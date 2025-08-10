import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TelegramService } from 'src/telegram/telegram.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { SelectedPlayerDto } from './dto/selected-player.dto';
import { UpdateCardDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
import { PlayerService } from './player.service';

@Controller('cards')
export class PlayerController {
  private selectionCounter: number = 0;
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
      this.selectionCounter = 0;
      this.lastResetDate = today;
    }
  }

  @Get()
  findAll(): Promise<Player[]> {
    return this.playerService.findAll();
  }

  @HttpCode(200)
  async sendToTelegram(@Param('id') id: string): Promise<{ message: string }> {
    this.checkAndResetCounter(); // Проверяем перед отправкой
    this.selectionCounter++;

    const card = await this.playerService.findOne(+id);
    await this.telegramService.sendMessage(
      `
      Выбор #${this.selectionCounter}\n
      Был выбран Футболист "${card?.name}"!`,
    );
    return { message: 'Card information sent to Telegram successfully' };
  }

  @Post('selected')
  async handleSelectedCard(@Body() cardData: SelectedPlayerDto): Promise<{ status: string; cardId: number; }> {
    this.checkAndResetCounter();
    console.log('Received card data:', cardData);
    await this.sendToTelegram(String(cardData.id))
    await this.playerService.incrementClick(cardData.id);

    return { status: 'success', cardId: cardData.id };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Player | null> {
    return this.playerService.findOne(+id);
  }

  @Post()
  create(@Body() createCardDto: CreatePlayerDto): Promise<Player> {
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