import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MyAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { UserSecurity } from '../../types';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(MyAuthGuard)
  create(
    @CurrentUser() currentUser: UserSecurity,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(createPostDto, currentUser);
  }

  @Get()
  @UseGuards(MyAuthGuard)
  findAll(@CurrentUser() currentUser: UserSecurity) {
    return this.postsService.findAll(currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
