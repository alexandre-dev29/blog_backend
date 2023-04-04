import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UtilityService } from '../utility/utility.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CaslModule } from 'nest-casl';
import { postsPermissions } from './posts.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions: postsPermissions })],
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
