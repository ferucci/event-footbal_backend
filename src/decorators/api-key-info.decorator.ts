import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { AuthenticatedRequest } from '../types/request.types';

export interface ApiKeyInfo {
  key: string;
  type: string;
}

export const ApiKeyInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ApiKeyInfo => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.apiKey || !request.apiKeyType) {
      throw new UnauthorizedException('API ключ не найден в запросе');
    }

    return {
      key: request.apiKey,
      type: request.apiKeyType
    };
  },
);