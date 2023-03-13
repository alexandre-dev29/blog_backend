import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponse } from '../../types';
import { FastifyReply } from 'fastify';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: AuthResponse })
  @Post('signup')
  signUp(@Body() signupDto: CreateUserDto) {
    return this.usersService.registerUser(signupDto);
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ type: AuthResponse })
  @Post('loginUser')
  async loginUser(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<AuthResponse> {
    const values = await this.usersService.loginUser(loginDto);
    const tokenString = `token=${
      values.accessToken
    };HttpOnly;Path=/;Max-Age=${86400};samesite=Strict;`;
    response.header('Set-Cookie', tokenString);
    return { ...values, accessToken: '' };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
