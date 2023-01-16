import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wallet } from '@prisma/client';
import {
  CreateWalletInput,
  UpdateWalletInput,
} from 'src/common/graphql/graphql';
import { oneEmojiRegex } from 'src/common/regex/emoji';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(userId: string) {
    return this.prismaService.wallet.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(userId: string, walletId: string) {
    return this.findOneAndValidateOwnership(userId, walletId);
  }

  create(userId: string, createWalletInput: CreateWalletInput) {
    const { name, icon, balance } = createWalletInput;

    // Validate input
    if (!icon.match(oneEmojiRegex)) {
      throw new BadRequestException('`icon` must be 1 emoji');
    }

    return this.prismaService.wallet.create({
      data: {
        name,
        icon,
        balance,
        userId,
      },
    });
  }

  async update(userId: string, updateWalletInput: UpdateWalletInput) {
    const { id, name, icon } = updateWalletInput;

    const wallet = await this.findOneAndValidateOwnership(userId, id);

    // Validate input
    if (icon && !icon.match(oneEmojiRegex)) {
      throw new BadRequestException('`icon` must be 1 emoji');
    }

    return this.prismaService.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        name: name ?? undefined,
        icon: icon ?? undefined,
      },
    });
  }

  async remove(userId: string, walletId: string) {
    const wallet = await this.findOneAndValidateOwnership(userId, walletId);

    return this.prismaService.wallet.delete({
      where: {
        id: wallet.id,
      },
    });
  }

  async updateBalance(userId: string, walletId: string, newBalance: number) {
    const wallet = await this.findOneAndValidateOwnership(userId, walletId);

    return this.prismaService.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        balance: newBalance,
      },
    });
  }

  private async findOneAndValidateOwnership(
    userId: string,
    walletId: string,
  ): Promise<Wallet> {
    const wallet = await this.prismaService.wallet.findUnique({
      where: {
        id: walletId,
      },
    });

    // Check if wallet exists
    if (!wallet) {
      throw new NotFoundException(`Wallet ${walletId} not found`);
    }

    // Validate ownership
    if (wallet.userId !== userId) {
      throw new ForbiddenException(
        `You don't have access to wallet ${walletId}`,
      );
    }

    return wallet;
  }
}
