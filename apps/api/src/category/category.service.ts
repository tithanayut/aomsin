import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from 'src/common/graphql/graphql';
import { oneEmojiRegex } from 'src/common/regex/emoji';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(userId: string) {
    return this.prismaService.category.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(userId: string, categoryId: string) {
    return this.findOneAndValidateOwnership(userId, categoryId);
  }

  create(userId: string, createCategoryInput: CreateCategoryInput) {
    const { type, name, icon, note } = createCategoryInput;

    // Validate input
    if (!icon.match(oneEmojiRegex)) {
      throw new BadRequestException('`icon` must be 1 emoji');
    }

    return this.prismaService.category.create({
      data: {
        type,
        name,
        icon,
        note: note ?? '',
        userId,
      },
    });
  }

  async update(userId: string, updateCategoryInput: UpdateCategoryInput) {
    const { id, name, icon, note } = updateCategoryInput;

    const category = await this.findOneAndValidateOwnership(userId, id);

    // Validate input
    if (icon && !icon.match(oneEmojiRegex)) {
      throw new BadRequestException('`icon` must be 1 emoji');
    }

    return this.prismaService.category.update({
      where: {
        id: category.id,
      },
      data: {
        name: name ?? undefined,
        icon: icon ?? undefined,
        note: note ?? undefined,
      },
    });
  }

  async remove(userId: string, categoryId: string) {
    const category = await this.findOneAndValidateOwnership(userId, categoryId);

    // Check if wallet is referenced by any transactions
    if (category.transaction.length > 0) {
      throw new BadRequestException(
        `Category ${categoryId} has one or more transactions associated`,
      );
    }

    return this.prismaService.category.delete({
      where: {
        id: category.id,
      },
    });
  }

  private async findOneAndValidateOwnership(
    userId: string,
    categoryId: string,
  ) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        transaction: true,
      },
    });

    // Check if category exists
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} not found`);
    }

    // Validate ownership
    if (category.userId !== userId) {
      throw new ForbiddenException(
        `You don't have access to category ${categoryId}`,
      );
    }

    return category;
  }
}
