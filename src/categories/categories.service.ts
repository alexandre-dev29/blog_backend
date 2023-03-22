import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  create({
    categoryName,
    categorySlug,
    categoryDescription,
    mainImageUrl,
  }: CreateCategoryDto) {
    return this.prismaService.categories.create({
      data: { categoryDescription, categoryName, categorySlug, mainImageUrl },
    });
  }

  findAll() {
    return this.prismaService.categories.findMany({ include: { posts: true } });
  }

  findOne(id: string) {
    return this.prismaService.categories.findUnique({ where: { id: id } });
  }

  update(
    id: string,
    {
      categoryName,
      categorySlug,
      categoryDescription,
      mainImageUrl,
    }: UpdateCategoryDto,
  ) {
    return this.prismaService.categories.update({
      where: { id },
      data: { categoryDescription, categoryName, categorySlug, mainImageUrl },
    });
  }

  remove(id: string) {
    return this.prismaService.categories.delete({ where: { id: id } });
  }
}
