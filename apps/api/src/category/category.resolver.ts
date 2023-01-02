import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from 'src/common/graphql/graphql';
import { GqlAuthGuard } from 'src/common/guards/jwt.guard';
import { AuthUser } from 'types';

import { CategoryService } from './category.service';

@Resolver('Category')
@UseGuards(GqlAuthGuard)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query('categories')
  findAll(@CurrentUser() user: AuthUser) {
    return this.categoryService.findAll(user.id);
  }

  @Query('category')
  findOne(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return this.categoryService.findOne(user.id, id);
  }

  @Mutation('createCategory')
  create(
    @CurrentUser() user: AuthUser,
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.create(user.id, createCategoryInput);
  }

  @Mutation('updateCategory')
  update(
    @CurrentUser() user: AuthUser,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(user.id, updateCategoryInput);
  }

  @Mutation('deleteCategory')
  remove(@CurrentUser() user: AuthUser, @Args('id') id: string) {
    return this.categoryService.remove(user.id, id);
  }
}
