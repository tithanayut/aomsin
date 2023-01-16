import { Module } from '@nestjs/common';
import { CategoryModule } from 'src/category/category.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WalletModule } from 'src/wallet/wallet.module';

import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';

@Module({
  imports: [PrismaModule, WalletModule, CategoryModule],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
