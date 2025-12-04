export class CreateConsentDto {
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  playerId: number;
  site: string;
  consentType?: string;
  consentVersion?: string;
  referrerUrl?: string;
}