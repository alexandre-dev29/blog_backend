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
import {
  AuthResponse,
  cookieOption,
  ResponseTypeEnum,
  SecurityActions,
  UserSecurity,
} from '../../types';
import { MyAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { Users } from '../generated/users';
import { AccessGuard, UseAbility } from 'nest-casl';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({ type: CreateUserDto })
  @Post()
  @UseGuards(MyAuthGuard, AccessGuard)
  @UseAbility(SecurityActions.create, Users)
  create(@Body() signupDto: CreateUserDto) {
    return this.usersService.registerUser(signupDto);
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ type: AuthResponse })
  @Post('loginUser')
  async loginUser(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const values = await this.usersService.loginUser(loginDto);
    response.cookie('token', values.accessToken, cookieOption);
    return { ...values, accessToken: '' };
  }

  @Get()
  @UseGuards(MyAuthGuard, AccessGuard)
  @UseAbility(SecurityActions.readAll, Users)
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
  @UseGuards(MyAuthGuard, AccessGuard)
  @UseAbility(SecurityActions.readOne, Users)
  async findOne(@Param('id') id: string) {
    const userGet = await this.usersService.findOne(id);
    return { ...userGet, password: '', refreshToken: '' };
  }

  @Get('me')
  @UseGuards(MyAuthGuard)
  async me(@CurrentUser() currentUser: UserSecurity) {
    const userGet = await this.usersService.findOne(currentUser.id);
    return { ...userGet, password: '', refreshToken: '' };
  }

  @Patch(':id')
  @UseGuards(MyAuthGuard, AccessGuard)
  @UseAbility(SecurityActions.readOne, Users)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(MyAuthGuard, AccessGuard)
  @UseAbility(SecurityActions.readOne, Users)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('logoutUser')
  async logoutUser(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    response.cookie('token', '', {
      httpOnly: true,
      path: '/',
      sameSite: true,
      expires: new Date(),
    });
    return {
      message: 'logout successfully',
      data: {},
      responseType: ResponseTypeEnum.SUCCESS,
    };
  }
}
