import { Tags } from './tags';
import { Users } from './users';
import { Category } from './category';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Post {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  postTitle: string;

  @ApiProperty({ type: String })
  postDescription: string;

  @ApiProperty({ type: Number })
  postViewCount: number;

  @ApiProperty({ type: String })
  postSlug: string;

  @ApiProperty({ type: String })
  postMainImage: string;

  @ApiProperty({ type: String })
  authorId: string;

  @ApiProperty({ isArray: true, type: () => Tags })
  Tags: Tags[];

  @ApiProperty({ type: Boolean })
  isPublished: boolean;

  @ApiProperty({ type: Boolean })
  isFeatured: boolean;

  @ApiPropertyOptional({ type: Date })
  publishedAt?: Date;

  @ApiProperty({ type: String })
  postContent: string;

  @ApiProperty({ type: () => Users })
  author: Users;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => Category })
  Category?: Category;

  @ApiPropertyOptional({ type: String })
  categoryId?: string;
}
