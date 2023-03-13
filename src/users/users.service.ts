import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponse, ResponseTypeEnum } from '../../types/authTypes';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UtilityService } from '../utility/utility.service';
import { Role } from '../../types';
import { Users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll(): Promise<Users[]> {
    return this.prismaService.users.findMany();
  }

  findOne(id: string): Promise<Users> {
    return this.prismaService.users.findFirst({ where: { id: id } });
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.prismaService.users.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  remove(id: string): Promise<Users> {
    return this.prismaService.users.delete({ where: { id: id } });
  }

  async loginUser({ password, email }: LoginUserDto): Promise<AuthResponse> {
    if (!email) {
      email = 'axel.business29@gmail.com';
    }
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

      return {
        message: 'Login Successfully',
        responseType: ResponseTypeEnum.SUCCESS,
        refreshToken: refresh_token,
        accessToken: access_token,
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

  async registerUser({
    fullName,
    password,
    email,
  }: CreateUserDto): Promise<AuthResponse> {
    const userFounded = await this.prismaService.users.findFirst({
      where: { email: email },
    });

    if (userFounded) {
      return {
        message: 'This user already exist',
        data: {},
        responseType: ResponseTypeEnum.ERROR,
      };
    }

    const encryptedPassword = await bcrypt
      .hash(password, 10)
      .then((value) => value);

    try {
      await this.prismaService.users.create({
        data: {
          email,
          fullName,
          password: encryptedPassword,
          username: '',
          phoneNumber: '',
          role: Role.User,
        },
      });

      return {
        message: 'The user has been created please login',
        responseType: ResponseTypeEnum.SUCCESS,
        data: { email: email, fullName: fullName, role: Role.User },
      };
    } catch (e) {
      console.log(e);
      return {
        message: 'There was an error while trying to create the account',
        data: {},
        responseType: ResponseTypeEnum.ERROR,
      };
    }
  }
}
