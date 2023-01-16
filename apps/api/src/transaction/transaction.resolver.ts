import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateTransactionInput } from 'src/common/graphql/graphql';
import { GqlAuthGuard } from 'src/common/guards/jwt.guard';
import { AuthUser } from 'types';

import { TransactionService } from './transaction.service';

@Resolver('Transaction')
@UseGuards(GqlAuthGuard)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query('transactions')
  findAll(@CurrentUser() user: AuthUser) {
    return this.transactionService.findAll(user.id);
  }

  @Query('transaction')
  findOne(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return this.transactionService.findOne(user.id, id);
  }

  @Mutation('createTransaction')
  create(
    @CurrentUser() user: AuthUser,
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionService.createTransaction(
      user.id,
      createTransactionInput,
    );
  }

  // @Mutation('updateTransaction')
  // update(
  //   @Args('updateTransactionInput')
  //   updateTransactionInput: UpdateTransactionInput,
  // ) {
  //   return this.transactionService.update(
  //     updateTransactionInput.id,
  //     updateTransactionInput,
  //   );
  // }

  // @Mutation('removeTransaction')
  // remove(@Args('id') id: number) {
  //   return this.transactionService.remove(id);
  // }
}
