import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';

// Экранизация и санитизация
import sanitizeHtml from 'sanitize-html';
// Защита от timing-атак
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  // Хардкодим данные одного пользователя (временное решение)
  private readonly singleUser = {
    id: '1',
    email: String(process.env.SI_EMAIL),
    passwordHash: String(process.env.PASSWORD_HASH)
  };

  // Хранилище для отслеживания неудачных попыток входа
  private failedAttempts = new Map<string, { count: number, lastAttempt: number }>();
  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_TIME_MS = 15 * 60 * 1000; // 15 минут

  constructor(private jwtService: JwtService) { }

  //  Защита от timing-атак
  private async timingSafeCompare(a: string, b: string): Promise<boolean> {
    const aBuff = Buffer.from(a);
    const bBuff = Buffer.from(b);
    return crypto.timingSafeEqual(aBuff, bBuff);
  }

  private checkAttempts(email: string): void {
    const attemptData = this.failedAttempts.get(email);

    if (attemptData) {
      // Если превышено максимальное количество попыток и не прошло время блокировки
      if (attemptData.count >= this.MAX_ATTEMPTS &&
        Date.now() - attemptData.lastAttempt < this.BLOCK_TIME_MS) {
        throw new ForbiddenException('Too many failed attempts. Please try again later.');
      }

      // Сброс счетчика если прошло время блокировки
      if (Date.now() - attemptData.lastAttempt >= this.BLOCK_TIME_MS) {
        this.failedAttempts.delete(email);
      }
    }
  }

  private recordFailedAttempt(email: string): void {
    const attemptData = this.failedAttempts.get(email) || { count: 0, lastAttempt: 0 };

    this.failedAttempts.set(email, {
      count: attemptData.count + 1,
      lastAttempt: Date.now()
    });
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    // Проверка ограничений перед попыткой входа
    this.checkAttempts(loginDto.email);

    // Проверка наличия email и password
    if (!loginDto.email || !loginDto.password) {
      throw new UnauthorizedException('Email and password are required');
    }

    // Валидация email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginDto.email)) {
      throw new UnauthorizedException('Invalid email format');
    }

    // Проверка длины пароля
    if (loginDto.password.length < 6) {
      throw new UnauthorizedException('Password must be at least 6 characters');
    }

    const cleanEmail = sanitizeHtml(loginDto.email.trim().toLowerCase());
    const cleanPassword = sanitizeHtml(loginDto.password.trim());

    if (cleanEmail !== this.singleUser.email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Проверка email с защитой от timing-атак
    const emailMatches = await this.timingSafeCompare(cleanEmail, this.singleUser.email);
    if (!emailMatches) {
      this.recordFailedAttempt(loginDto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(
      cleanPassword,
      this.singleUser.passwordHash
    );

    if (!isPasswordValid) {
      this.recordFailedAttempt(loginDto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Сброс счетчика при успешном входе
    this.failedAttempts.delete(loginDto.email);

    // Генерируем токен
    const payload = { sub: this.singleUser.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d'
    });

    return {
      accessToken,
      expiresIn: 84000,
      user: {
        id: this.singleUser.id,
        email: this.singleUser.email
      },
    };
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }
}