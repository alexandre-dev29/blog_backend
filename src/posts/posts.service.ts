import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role, UserSecurity } from '../../types';
import { UtilityService } from '../utility/utility.service';
import { PrismaService } from '../prisma/prisma.service';
import { SetPublishedDto } from './dto/setPublished.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readingTime = require('reading-time');

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
    const read = readingTime(postContent);

    return this.prismaService.posts.create({
      data: {
        postSlug: slug,
        postMainImage,
        postTitle,
        postContent,
        postDescription,
        categoryId,
        authorId: currentUser.id,
        postReadTime: Math.round(read.minutes),
        isFeatured: false,
        isPublished: false,
        postViewCount: 0,
      },
    });
  }

  async findAll() {
    const allPosts = await this.prismaService.posts.findMany({
      include: { author: true, Category: true, Tags: true },
      where: { isPublished: true },
    });
    const transformed = allPosts.map((value) => {
      const author = value.author;
      author.password = '';
      author.refreshToken = '';
      return { ...value, author: author };
    });
    return transformed;
  }

  findBySlug(postSlug: string) {
    return this.prismaService.posts.findUnique({
      include: { author: true, Category: true, Tags: true },
      where: { postSlug },
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
    const read = readingTime(postContent);
    return this.prismaService.posts.update({
      where: { id },
      data: {
        postTitle,
        postDescription,
        postContent,
        postReadTime: Math.round(read.minutes),
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
