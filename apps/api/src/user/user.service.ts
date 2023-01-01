import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, User, UserProvider } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'types';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLocalUser(createUserDto: CreateUserDto) {
    const { name, username, password } = createUserDto;

    // Validate input
    if (!name || !username || !password) {
      throw new BadRequestException(
        '`name`, `username` and `password` are required',
      );
    }
    if (password.length < 8) {
      throw new BadRequestException('`password` must be at least 8 characters');
    }

    // Create user
    let user: User;
    try {
      const newUser: Prisma.UserCreateInput = {
        provider: UserProvider.LOCAL,
        name,
        username: username.toLowerCase(),
        password: await this.hashPassword(password),
      };

      user = await this.prismaService.user.create({ data: newUser });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(`Username ${username} already exists`);
        }
      }
      throw new InternalServerErrorException();
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
