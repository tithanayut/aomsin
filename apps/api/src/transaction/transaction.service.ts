import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';
import {
  CreateTransactionInput,
  TransactionType,
} from 'src/common/graphql/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly walletService: WalletService,
    private readonly categoryService: CategoryService,
  ) {}

  findAll(userId: string) {
    return this.prismaService.transaction.findMany({
      where: {
        userId,
      },
      include: {
        wallet: true,
        transferWallet: true,
        category: true,
      },
    });
  }

  findOne(userId: string, transactionId: string) {
    return this.findOneAndValidateOwnership(userId, transactionId);
  }

  async createTransaction(
    userId: string,
    createTransactionInput: CreateTransactionInput,
  ) {
    const { type, walletId, categoryId, amount, note } = createTransactionInput;

    // Parse datetime
    let datetime = createTransactionInput.datetime;
    if (!createTransactionInput.datetime) {
      datetime = new Date();
    } else {
      datetime = new Date(createTransactionInput.datetime);
      if (isNaN(datetime.getTime())) {
        throw new BadRequestException('`datetime` is invalid');
      }
    }

    // Validate input
    if (amount < 0) {
      throw new BadRequestException('`amount` must be greater than 0');
    }

    // Check if wallet and category exists and belongs to user
    const wallet = await this.walletService.findOne(userId, walletId);
    const category = await this.categoryService.findOne(userId, categoryId);

    // Check if category is income or expense
    if (type !== category.type) {
      throw new BadRequestException(
        `Category ${categoryId} is not of ${type} type`,
      );
    }

    // Deduct amount from wallet balance
    let newBalance: number;
    switch (type) {
      case TransactionType.INCOME: {
        newBalance = wallet.balance + amount;
        break;
      }
      case TransactionType.EXPENSE: {
        newBalance = wallet.balance - amount;
        break;
      }
      default:
        throw new BadRequestException(
          'Only INCOME or EXPENSE `type` is supported',
        );
    }
    await this.walletService.updateBalance(userId, wallet.id, newBalance);

    return this.prismaService.transaction.create({
      data: {
        userId,
        datetime,
        type,
        walletId: wallet.id,
        categoryId: category.id,
        amount,
        note,
      },
      include: {
        wallet: true,
        transferWallet: true,
        category: true,
      },
    });
  }

  // createTransferTransaction() {}

  // update(id: number, updateTransactionInput: UpdateTransactionInput) {
  //   return `This action updates a #${id} transaction`;
  // }

  async remove(userId: string, transactionId: string) {
    const transaction = await this.findOneAndValidateOwnership(
      userId,
      transactionId,
    );

    // Update wallet balance
    const wallet = await this.walletService.findOne(
      userId,
      transaction.walletId,
    );
    const newBalance = wallet.balance - transaction.amount;
    await this.walletService.updateBalance(userId, wallet.id, newBalance);

    return this.prismaService.transaction.delete({
      where: {
        id: transaction.id,
      },
      include: {
        wallet: true,
        transferWallet: true,
        category: true,
      },
    });
  }

  private async findOneAndValidateOwnership(
    userId: string,
    transactionId: string,
  ): Promise<Transaction> {
    const transaction = await this.prismaService.transaction.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        wallet: true,
        transferWallet: true,
        category: true,
      },
    });

    // Check if transaction exists
    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionId} not found`);
    }

    // Validate ownership
    if (transaction.userId !== userId) {
      throw new ForbiddenException(
        `You don't have access to transaction ${transactionId}`,
      );
    }

    return transaction;
  }
}
