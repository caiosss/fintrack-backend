import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

const cookieExtractor = (request: Request) => {
  if (!request?.cookies) return null;
  return request.cookies.access_token ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      expiration: '7d',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub }});
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }
}
