import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponse, ResponseTypeEnum, Role } from '../../types';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UtilityService } from '../utility/utility.service';
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
    return this.prismaService.users.findMany({});
  }

  findOne(id: string) {
    return this.prismaService.users.findFirst({
      where: { id: id },
      include: { Posts: true },
    });
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
          username: user.username,
          avatarImage: user.avatarImage,
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
    userTitle,
    phoneNumber,
    biography,
    avatarImage,
  }: CreateUserDto) {
    try {
      const userFounded = await this.prismaService.users.findFirst({
        where: { email: email },
      });

      if (userFounded) {
        return new Error(
          'This Email already exist please try to register with another',
        );
      }

      const encryptedPassword = await bcrypt
        .hash(password, 10)
        .then((value) => value);
      await this.prismaService.users.create({
        data: {
          email,
          fullName,
          userTitle,
          phoneNumber,
          biography,
          avatarImage,
          password: encryptedPassword,
          role: Role.Editor,
        },
      });

      return {
        message: 'The user has been created please login',
        responseType: ResponseTypeEnum.SUCCESS,
        data: { email: email, fullName: fullName, role: Role.Editor },
      };
    } catch (e) {
      console.log(e);
      return new Error(e.message);
    }
  }
}
