import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  // валидные API ключи в Set для быстрого поиска
  private validApiKeys: Set<string>;

  constructor(private configService: ConfigService) {
    const apiKeysString = this.configService.get<string>('API_KEYS') || '';
    this.validApiKeys = new Set(apiKeysString.split(',').filter(key => key.trim()));
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Получаем API ключ из заголовков
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API ключ отсутствует. Добавьте заголовок X-API-Key');
    }

    if (!this.isValidApiKey(apiKey)) {
      throw new UnauthorizedException('Неверный API ключ');
    }

    // Добавляем информацию о ключе в запрос для дальнейшего использования
    request.apiKey = apiKey;
    request.apiKeyType = this.getApiKeyType(apiKey);

    return true;
  }

  private extractApiKey(request: any): string | null {
    // Проверяем заголовок X-API-Key
    const headerKey = request.headers['x-api-key'];
    if (headerKey) {
      return headerKey;
    }

    // Альтернативно: проверяем Authorization header с префиксом "ApiKey "
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('ApiKey ')) {
      return authHeader.substring(7); // Убираем "ApiKey " префикс
    }

    return null;
  }

  private isValidApiKey(apiKey: string): boolean {
    return this.validApiKeys.has(apiKey);
  }

  private getApiKeyType(apiKey: string): string {
    if (apiKey.startsWith('spartak-')) return 'spartak';
    if (apiKey.startsWith('dinamo-')) return 'dinamo';
    if (apiKey.startsWith('admin-')) return 'admin';
    return 'unknown';
  }
}