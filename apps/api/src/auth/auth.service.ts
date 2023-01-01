import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CredentialDto, LoginDto } from 'types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
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
      throw new BadRequestException(`User ${username} has been disabled`);
    }

    // Validate password
    const passwordValid = await this.validatePassword(password, user.password);
    if (!passwordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Update lastLoggedIn
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { lastLoggedIn: new Date() },
    });

    // Generate JWT
    const accessToken = await this.jwtService.signAsync(
      { name: user.name },
      { subject: user.id.toString() },
    );

    return {
      accessToken,
    };
  }

  private validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
