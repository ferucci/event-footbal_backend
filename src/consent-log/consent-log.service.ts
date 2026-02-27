import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConsentDto } from './dto/create-consent.dto';
import { ConsentLog } from './entities/consent-log.entity';

@Injectable()
export class ConsentLogService {
  constructor(
    @InjectRepository(ConsentLog)
    private readonly consentRepository: Repository<ConsentLog>,
  ) { }

  async createConsent(createConsentDto: CreateConsentDto): Promise<ConsentLog> {
    const consent = this.consentRepository.create({
      ...createConsentDto,
      consentAccepted: true,
      consentDate: new Date(),
    });

    return this.consentRepository.save(consent);
  }

  async getConsentsByIp(ipAddress: string): Promise<ConsentLog[]> {
    return this.consentRepository.find({
      where: { ipAddress },
      order: { consentDate: 'DESC' },
    });
  }

  async getConsentsBySession(sessionId: string): Promise<ConsentLog[]> {
    return this.consentRepository.find({
      where: { sessionId },
      order: { consentDate: 'DESC' },
    });
  }

  async hasGivenConsentToday(ipAddress: string, playerId: number): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.consentRepository.count({
      where: {
        ipAddress,
        playerId,
        consentDate: today,
      },
    });

    return count > 0;
  }

  // async getConsentStats(site, startDate, endDate) {
  //   return {}
  // }
}