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
import { AuthResponse } from '../../types/authTypes';
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
    return this.usersService.signUpUser(signupDto);
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ type: AuthResponse })
  @Post('loginUser')
  loginUser(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<AuthResponse> {
    return this.usersService.loginUser(loginDto, response);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
