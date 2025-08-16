import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    }

    this.bot = new TelegramBot(token, { polling: false });
  }

  async sendMessage(message: string): Promise<void> {
    const chatId1 = this.configService.get('TELEGRAM_CHAT_ID');
    const chatId2 = this.configService.get('TELEGRAM_CHAT_ID_2');

    if (!chatId1 && !chatId2) {
      throw new Error('Neither TELEGRAM_CHAT_ID nor TELEGRAM_CHAT_ID_2 are defined');
    }

    try {

      if (chatId1) {
        await this.bot.sendMessage(chatId1, message);
        this.logger.log(`Message sent to Telegram chat 1: ${message}`);
      }

      if (chatId2) {
        await this.bot.sendMessage(chatId2, message);
        this.logger.log(`Message sent to Telegram chat 2: ${message}`);
      }

    } catch (error) {
      this.logger.error(`Failed to send Telegram message: ${error.message}`);
      throw error;
    }
  }
}