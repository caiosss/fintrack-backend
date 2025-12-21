/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const parseJwtExpiresInToMs = (value?: string) => {
  if (!value) return undefined;
  const numeric = Number(value);
  if (!Number.isNaN(numeric)) {
    return numeric * 1000;
  }
  const match = value.trim().match(/^(\d+)([smhd])$/i);
  if (!match) return undefined;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const unitMs =
    unit === 's' ? 1000 :
    unit === 'm' ? 60_000 :
    unit === 'h' ? 3_600_000 :
    86_400_000;
  return amount * unitMs;
};

const normalizeSameSite = (
  value?: string
): CookieOptions['sameSite'] => {
  const normalized = (value ?? 'lax').toLowerCase();

  if (normalized === 'strict' || normalized === 'lax' || normalized === 'none') {
    return normalized;
  }

  return 'lax';
};

const parseBoolean = (value?: string) => value === 'true';

const getCookieBaseOptions = () => ({
  httpOnly: true,
  secure: parseBoolean(process.env.COOKIE_SECURE) || process.env.NODE_ENV === 'production',
  sameSite: normalizeSameSite(process.env.COOKIE_SAMESITE),
  path: '/',
  ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() data: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(data.email, data.password);
    const maxAge = parseJwtExpiresInToMs(process.env.JWT_EXPIRES_IN);
    const cookieOptions = {
      ...getCookieBaseOptions(),
      ...(maxAge ? { maxAge } : {}),
    };

    response.cookie('access_token', result.access_token, cookieOptions);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: Request) {
    return request.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', getCookieBaseOptions());
    return { message: 'Logout realizado com sucesso.' };
  }
}
