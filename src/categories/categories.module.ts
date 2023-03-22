import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CaslModule } from 'nest-casl';
import { categoryPermissions } from './categories.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions: categoryPermissions })],
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
