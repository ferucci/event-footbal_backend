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
    const chatId = this.configService.get('TELEGRAM_CHAT_ID');
    if (!chatId) {
      throw new Error('TELEGRAM_CHAT_ID is not defined');
    }

    try {
      await this.bot.sendMessage(chatId, message);
      this.logger.log(`Message sent to Telegram: ${message}`);
    } catch (error) {
      this.logger.error(`Failed to send Telegram message: ${error.message}`);
      throw error;
    }
  }
}