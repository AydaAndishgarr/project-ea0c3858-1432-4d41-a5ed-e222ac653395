import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Response } from 'express';
import { roleToUi } from '../common/locale/fa-map';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_COOKIE_DEFAULT } from './auth.constants';
import { accessTokenCookieOptions } from './cookie-options';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid email or password');
    }
    const ok = await compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = { sub: user.id, role: user.role };
    const token = await this.jwt.signAsync(payload);
    this.setCookie(res, token);
    await this.prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });
    return this.publicUser(user);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException();
    }
    return this.publicUser(user);
  }

  logout(res: Response) {
    res.clearCookie(this.cookieName(), { ...this.cookieOpts(), maxAge: 0 });
    return { ok: true };
  }

  private publicUser(user: { id: string; email: string; phone: string; fullName: string; role: JwtPayload['role'] }) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      role: roleToUi[user.role],
    };
  }

  private setCookie(res: Response, token: string) {
    res.cookie(this.cookieName(), token, { ...this.cookieOpts(), maxAge: 24 * 60 * 60 * 1000 });
  }

  private cookieName() {
    return this.config.get<string>('cookie.name') ?? AUTH_COOKIE_DEFAULT;
  }

  private cookieOpts() {
    return accessTokenCookieOptions({
      secure: this.config.get<boolean>('cookie.secure') ?? false,
      sameSite: this.config.get<'lax' | 'strict' | 'none'>('cookie.sameSite') ?? 'lax',
    });
  }
}
