import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UtilityService } from '../utility/utility.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    PrismaService,
    UtilityService,
    JwtService,
    ConfigService,
  ],
})
export class PostsModule {}
