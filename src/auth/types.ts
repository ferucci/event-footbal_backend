import { Request } from 'express';

export interface JwtPayload {
  sub: string; // ID пользователя
  email: string;
  // Другие поля payload
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}