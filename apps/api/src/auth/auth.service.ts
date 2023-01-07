import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserProvider } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CredentialDto, JwtPayload, LoginDto } from 'types';

import { LdapService } from './ldap.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly ldapService: LdapService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<CredentialDto> {
    const { username, password } = loginDto;

    // Validate input
    if (!username || !password) {
      throw new BadRequestException('`username` and `password` are required');
    }

    // Find user
    const user = await this.prismaService.user.findUnique({
      where: { username: username.toLowerCase() },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new BadRequestException(`User ${user.username} has been disabled`);
    }

    // Validate password
    const passwordValid = await this.validatePassword(password, user.password);
    if (!passwordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.issueAccessToken(user);
  }

  async ldapLogin(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    // Validate input
    if (!username || !password) {
      throw new BadRequestException('`username` and `password` are required');
    }

    // Validate user
    const ldapUser = await this.ldapService.validateUser(username, password);
    if (!ldapUser) {
      throw new BadRequestException('Invalid credentials');
    }

    // Check if user exists
    let user = await this.prismaService.user.findUnique({
      where: {
        provider_provider_uid: {
          provider: UserProvider.LDAP,
          provider_uid: ldapUser.dn,
        },
      },
    });
    if (user && !user.isActive) {
      throw new BadRequestException(`User ${user.id} has been disabled`);
    }

    // Create user if not exists
    if (!user) {
      user = await this.userService.createExternalUser(
        UserProvider.LDAP,
        ldapUser.dn,
        ldapUser?.displayName.toString() ?? 'User',
      );
    }

    return this.issueAccessToken(user);
  }

  private validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async issueAccessToken(user: User): Promise<CredentialDto> {
    // Update lastLoggedIn
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { lastLoggedIn: new Date() },
    });

    // Generate JWT
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      name: user.name,
    });

    return {
      accessToken,
    };
  }
}
