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
    const chatIdsStr = this.configService.get('TELEGRAM_CHAT_IDS');

    if (!chatIdsStr) {
      throw new Error('TELEGRAM_CHAT_IDS is not defined');
    }

    const chatIds = chatIdsStr.split(',');

    try {
      for (const chatId of chatIds) {
        await this.bot.sendMessage(chatId, message);
        this.logger.log(`Message sent to Telegram chat ${chatId}: ${message}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send Telegram message: ${error.message}`);
      throw error;
    }
  }
}