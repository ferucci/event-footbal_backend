import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import type { AuthenticatedRequest } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout() {
    // В реальном приложении здесь можно инвалидировать токен
    return { message: 'Logged out successfully' };
  }

  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  async verifyToken(@Req() req: AuthenticatedRequest) {
    try {
      return {
        isValid: true,
        user: {
          id: req.user.sub,
          email: req.user.email
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}