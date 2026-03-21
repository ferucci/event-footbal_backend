// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import TelegramBot from 'node-telegram-bot-api';

// @Injectable()
// export class TelegramService {
//   private bot: TelegramBot;
//   private readonly logger = new Logger(TelegramService.name);

//   constructor(private readonly configService: ConfigService) {
//     const token = this.configService.get('TELEGRAM_BOT_TOKEN');
//     if (!token) {
//       throw new Error('TELEGRAM_BOT_TOKEN is not defined');
//     }

//     this.bot = new TelegramBot(token, { polling: false });
//   }

//   async sendMessage(message: string): Promise<void> {
//     const chatIdsStr = this.configService.get('TELEGRAM_CHAT_IDS');

//     if (!chatIdsStr) {
//       throw new Error('TELEGRAM_CHAT_IDS is not defined');
//     }

//     const chatIds = chatIdsStr.split(',');

//     try {
//       for (const chatId of chatIds) {
//         await this.bot.sendMessage(chatId, message);
//         this.logger.log(`Message sent to Telegram chat ${chatId}: ${message}`);
//       }
//     } catch (error) {
//       this.logger.error(`Failed to send Telegram message: ${error.message}`);
//       throw error;
//     }
//   }
// }


// Версия с прокси:


import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  private readonly logger = new Logger(TelegramService.name);
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY_MS = 1000; // начальная задержка 1 секунда

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    }

    // Получаем URL Cloudflare Worker из конфигурации
    const workerUrl = this.configService.get('TELEGRAM_WORKER_URL');

    if (!workerUrl) {
      this.logger.warn('TELEGRAM_WORKER_URL is not defined, using direct API');
      // Стандартный режим (для разработки или если worker не используется)
      this.bot = new TelegramBot(token, { polling: false });
    } else {
      this.logger.log(`Using Telegram worker proxy: ${workerUrl}`);
      // Режим через Cloudflare Worker
      this.bot = new TelegramBot(token, {
        polling: false,
        baseApiUrl: workerUrl, // URL вашего Cloudflare Worker
        // Важно: request агент с увеличенным таймаутом
        request: {
          timeout: 10000, // 10 секунд
        } as any
      });
    }
  }

  /**
   * Метод для повторной попытки с экспоненциальной задержкой
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    context: string,
    retryCount: number = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retryCount >= this.MAX_RETRIES) {
        this.logger.error(`${context} - All ${this.MAX_RETRIES} retry attempts failed. Last error: ${error.message}`);
        throw error;
      }

      const delay = this.RETRY_DELAY_MS * Math.pow(2, retryCount);
      this.logger.warn(
        `${context} - Attempt ${retryCount + 1}/${this.MAX_RETRIES} failed. ` +
        `Retrying in ${delay}ms. Error: ${error.message}`
      );

      await this.sleep(delay);
      return this.retryWithBackoff(operation, context, retryCount + 1);
    }
  }

  /**
   * Вспомогательный метод для задержки
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Отправка сообщения с повторными попытками для одного чата
   */
  private async sendMessageWithRetry(
    chatId: string,
    message: string,
    options?: TelegramBot.SendMessageOptions
  ): Promise<void> {
    await this.retryWithBackoff(
      async () => {
        this.logger.debug(`Attempting to send message to chat ${chatId}`);
        await this.bot.sendMessage(chatId, message, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          ...options
        });
      },
      `Send message to ${chatId}`
    );
  }

  async sendMessage(message: string): Promise<void> {
    const chatIdsStr = this.configService.get('TELEGRAM_CHAT_IDS');

    if (!chatIdsStr) {
      throw new Error('TELEGRAM_CHAT_IDS is not defined');
    }

    const chatIds = chatIdsStr.split(',').filter(id => id.trim());

    if (chatIds.length === 0) {
      throw new Error('No valid TELEGRAM_CHAT_IDS found');
    }

    const results: Array<{ chatId: string; success: boolean; error?: string }> = [];

    for (const chatId of chatIds) {
      const trimmedChatId = chatId.trim();

      try {
        await this.sendMessageWithRetry(trimmedChatId, message);
        this.logger.log(`Message sent successfully to Telegram chat ${trimmedChatId}`);
        results.push({ chatId: trimmedChatId, success: true });
      } catch (error) {
        this.logger.error(`Failed to send message to chat ${trimmedChatId} after ${this.MAX_RETRIES} attempts: ${error.message}`);
        results.push({ chatId: trimmedChatId, success: false, error: error.message });
      }
    }

    // Проверяем, были ли успешные отправки
    const successfulSends = results.filter(r => r.success).length;

    if (successfulSends === 0) {
      // Если ни одно сообщение не отправилось
      const errors = results.map(r => `${r.chatId}: ${r.error}`).join(', ');
      throw new Error(`Failed to send messages to all chats after retries. Errors: ${errors}`);
    } else if (successfulSends < chatIds.length) {
      // Если отправилось не всем
      const failedChats = results.filter(r => !r.success).map(r => r.chatId).join(', ');
      this.logger.warn(`Messages sent successfully to ${successfulSends}/${chatIds.length} chats. Failed chats: ${failedChats}`);
    }
  }

  // Дополнительный метод для отправки сообщения с кастомными параметрами
  async sendMessageWithOptions(
    chatId: string,
    message: string,
    options?: TelegramBot.SendMessageOptions
  ): Promise<void> {
    await this.sendMessageWithRetry(chatId, message, options);
    this.logger.log(`Message sent to Telegram chat ${chatId}`);
  }

  /**
   * Метод для отправки сообщения с возможностью указать количество попыток
   */
  async sendMessageWithCustomRetry(
    message: string,
    customMaxRetries: number = this.MAX_RETRIES
  ): Promise<void> {
    const chatIdsStr = this.configService.get('TELEGRAM_CHAT_IDS');

    if (!chatIdsStr) {
      throw new Error('TELEGRAM_CHAT_IDS is not defined');
    }

    const chatIds = chatIdsStr.split(',').filter(id => id.trim());

    if (chatIds.length === 0) {
      throw new Error('No valid TELEGRAM_CHAT_IDS found');
    }

    for (const chatId of chatIds) {
      const trimmedChatId = chatId.trim();

      try {
        await this.retryWithBackoff(
          async () => {
            await this.bot.sendMessage(trimmedChatId, message, {
              parse_mode: 'HTML',
              disable_web_page_preview: true
            });
          },
          `Send message to ${trimmedChatId} (custom retries: ${customMaxRetries})`,
          0
        );
        this.logger.log(`Message sent to Telegram chat ${trimmedChatId}`);
      } catch (error) {
        this.logger.error(`Failed to send message to chat ${trimmedChatId}: ${error.message}`);
        throw error;
      }
    }
  }
}