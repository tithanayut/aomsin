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

  findAll(userId: string) {
    return this.prismaService.wallet.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(userId: string, walletId: string) {
    return this.findOneAndValidateOwnership(userId, walletId);
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
        name,
        icon,
      },
    });
  }

  async remove(userId: string, walletId: string) {
    await this.findOneAndValidateOwnership(userId, walletId);

    return this.prismaService.wallet.delete({
      where: {
        id: walletId,
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
