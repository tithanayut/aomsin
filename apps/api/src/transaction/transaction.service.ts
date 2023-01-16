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

    // Check if wallet has enough balance
    if (type === TransactionType.EXPENSE && wallet.balance < amount) {
      throw new BadRequestException(
        `Wallet ${walletId} doesn't have enough balance`,
      );
    }

    // Deduct amount from wallet balance
    switch (type) {
      case TransactionType.INCOME: {
        const newBalance = wallet.balance + amount;
        await this.walletService.updateBalance(userId, wallet.id, newBalance);
        break;
      }
      case TransactionType.EXPENSE: {
        const newBalance = wallet.balance - amount;
        await this.walletService.updateBalance(userId, wallet.id, newBalance);
        break;
      }
      default:
        throw new BadRequestException(
          'Only INCOME or EXPENSE `type` is supported',
        );
    }

    const signedAmount = type === TransactionType.INCOME ? amount : -amount;

    return this.prismaService.transaction.create({
      data: {
        userId,
        datetime,
        type,
        walletFromId: wallet.id,
        categoryId: category.id,
        amount: signedAmount,
        note,
      },
      include: {
        walletFrom: true,
        walletTo: true,
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
      transaction.walletFromId,
    );
    const newBalance = wallet.balance - transaction.amount;
    await this.walletService.updateBalance(userId, wallet.id, newBalance);

    return this.prismaService.transaction.delete({
      where: {
        id: transaction.id,
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
    });

    // Check if category exists
    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionId} not found`);
    }

    // Validate ownership
    if (transaction.userId !== userId) {
      throw new ForbiddenException(
        `You don't have access to category ${transactionId}`,
      );
    }

    return transaction;
  }
}
