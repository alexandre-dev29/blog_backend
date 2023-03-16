import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponse, cookieOption, UserSecurity } from '../../types';
import { FastifyReply } from 'fastify';
import { MyAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { Users } from '../generated/users';

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
    response.setCookie('token', values.accessToken, cookieOption);
    return { ...values, accessToken: '' };
  }

  @Get()
  @UseGuards(MyAuthGuard)
  async findAll(@CurrentUser() currentUser: UserSecurity) {
    let allUsers = await this.usersService.findAll();
    allUsers = allUsers.map((value) => ({
      ...value,
      password: '',
      refreshToken: '',
    }));
    return allUsers;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Users> {
    const userGet = await this.usersService.findOne(id);
    return { ...userGet, password: '', refreshToken: '' };
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
