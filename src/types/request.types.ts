import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  apiKey?: string;
  apiKeyType?: string;
}