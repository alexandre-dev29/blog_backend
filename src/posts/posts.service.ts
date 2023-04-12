import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role, UserSecurity } from '../../types';
import { UtilityService } from '../utility/utility.service';
import { PrismaService } from '../prisma/prisma.service';
import { SetPublishedDto } from './dto/setPublished.dto';

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

  findAll() {
    return this.prismaService.posts.findMany({
      include: { author: true, Category: true, Tags: true },
      where: { isPublished: true },
    });
  }

  findAllByConnected(currentUser: UserSecurity) {
    return currentUser.roles[0] === Role.Admin
      ? this.prismaService.posts.findMany({
          include: { author: true, Category: true, Tags: true },
        })
      : this.prismaService.posts.findMany({
          where: { authorId: currentUser.id },
        });
  }

  findOne(id: string) {
    return this.prismaService.posts.findUnique({ where: { id: id } });
  }

  update(
    id: string,
    {
      postTitle,
      postDescription,
      postContent,
      postMainImage,
      categoryId,
    }: UpdatePostDto,
  ) {
    return this.prismaService.posts.update({
      where: { id },
      data: {
        postTitle,
        postDescription,
        postContent,
        postMainImage,
        categoryId,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  updatePublishStatus({ isPublished, id }: SetPublishedDto) {
    return this.prismaService.posts.update({
      where: { id },
      data: { isPublished, publishedAt: new Date() },
    });
  }
}
