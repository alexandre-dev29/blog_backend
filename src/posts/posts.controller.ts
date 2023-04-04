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
import { SecurityActions, UserSecurity } from '../../types';
import { AccessGuard, UseAbility } from 'nest-casl';
import { Posts } from '../generated/posts';
import { SetPublishedDto } from './dto/setPublished.dto';

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
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(MyAuthGuard, AccessGuard)
  @UseAbility(SecurityActions.update, Posts)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Patch('handle/setPublished')
  @UseGuards(MyAuthGuard, AccessGuard)
  @UseAbility(SecurityActions.update, Posts)
  async setPublished(@Body() setPublishedDto: SetPublishedDto) {
    await this.postsService.updatePublishStatus(setPublishedDto);
    return true;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
