import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  CreateWalletInput,
  UpdateWalletInput,
} from 'src/common/graphql/graphql';
import { GqlAuthGuard } from 'src/common/guards/jwt.guard';
import { AuthUser } from 'types';

import { WalletService } from './wallet.service';

@Resolver('Wallet')
@UseGuards(GqlAuthGuard)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Query('wallets')
  findAll(@CurrentUser() user: AuthUser) {
    return this.walletService.findAll(user.id);
  }

  @Query('wallet')
  findOne(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return this.walletService.findOne(user.id, id);
  }

  @Mutation('createWallet')
  create(
    @CurrentUser() user: AuthUser,
    @Args('createWalletInput') createWalletInput: CreateWalletInput,
  ) {
    return this.walletService.create(user.id, createWalletInput);
  }

  @Mutation('updateWallet')
  update(
    @CurrentUser() user: AuthUser,
    @Args('updateWalletInput') updateWalletInput: UpdateWalletInput,
  ) {
    return this.walletService.update(user.id, updateWalletInput);
  }

  @Mutation('deleteWallet')
  remove(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return this.walletService.remove(user.id, id);
  }
}
