import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { WalletResolver } from './wallet.resolver';
import { WalletService } from './wallet.service';

@Module({
  imports: [PrismaModule],
  providers: [WalletResolver, WalletService],
  exports: [WalletService],
})
export class WalletModule {}
