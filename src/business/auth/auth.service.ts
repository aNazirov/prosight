import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '../../common/config';
import { AuthenticatedUser } from '../../common/types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly auth: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
  ) {}

  validateUser(username: string, password: string): AuthenticatedUser {
    const users = this.auth.users;
    const user = users.find(
      (candidate) =>
        candidate.username === username && candidate.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      username: user.username,
      role: user.role,
    };
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = this.validateUser(username, password);

    const accessToken = await this.jwtService.signAsync({
      sub: user.username,
      role: user.role,
    });

    return { accessToken };
  }
}
