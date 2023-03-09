import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  AuthResponse,
  cookieOption,
  ResponseTypeEnum,
} from '../../types/authTypes';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UtilityService } from '../utility/utility.service';
import { Role } from '../../types';
import { FastifyReply } from 'fastify';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async loginUser(
    { password, email }: LoginUserDto,
    response: FastifyReply,
  ): Promise<AuthResponse> {
    const user = await this.prismaService.users.findFirst({
      where: { email: email },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { refresh_token, access_token } =
        await this.utilityService.getTokens({
          id: user.id,
          roles: [user.role] as Array<Role>,
          email: email,
          fullName: user.fullName,
        });
      await this.prismaService.users.update({
        data: {
          refreshToken: refresh_token,
        },
        where: {
          id: user.id,
        },
      });
      const tokenString = `token=${access_token};HttpOnly;Path=/;Max-Age=${86400};samesite=Strict;`;
      response.setCookie('Authorization', tokenString, cookieOption);
      return {
        message: 'Login Successfully',
        responseType: ResponseTypeEnum.SUCCESS,
        refreshToken: refresh_token,
        data: {
          fullName: user.fullName,
          email: email,
          id: user.id,
          role: user.role,
          phoneNumber: user.phoneNumber,
        },
      } as AuthResponse;
    } else {
      return {
        message: 'Login Failed',
        responseType: ResponseTypeEnum.ERROR,
        refreshToken: '',
        data: {},
      };
    }
  }

  signUpUser(signupDto: CreateUserDto) {
    return '';
  }
}
