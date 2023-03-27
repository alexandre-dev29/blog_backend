import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role, UserSecurity } from '../../types';
import { UtilityService } from '../utility/utility.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(
    private utilityService: UtilityService,
    private prismaService: PrismaService,
  ) {}

  async create(
    {
      postTitle,
      postDescription,
      postContent,
      postMainImage,
      categoryId,
    }: CreatePostDto,
    currentUser: UserSecurity,
  ) {
    let slug = this.utilityService.generateSlug(postTitle);

    let slugExists = await this.prismaService.posts.findUnique({
      where: { postSlug: slug },
      select: { id: true },
    });
    while (slugExists) {
      slug = this.utilityService.generateSlug(postTitle);
      slugExists = await this.prismaService.posts.findUnique({
        where: { postSlug: slug },
        select: { id: true },
      });
    }

    return this.prismaService.posts.create({
      data: {
        postSlug: slug,
        postMainImage,
        postTitle,
        postContent,
        postDescription,
        categoryId,
        authorId: currentUser.id,
        isFeatured: false,
        isPublished: false,
        postViewCount: 0,
      },
    });
  }

  findAll(currentUser: UserSecurity) {
    return currentUser.roles[0] === Role.Admin
      ? this.prismaService.posts.findMany({
          include: { author: true, Category: true, Tags: true },
        })
      : this.prismaService.posts.findMany({
          where: { authorId: currentUser.id },
        });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
