import { Users } from '../src/generated/users';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CookieSerializeOptions } from '@fastify/cookie';

export enum ResponseTypeEnum {
  SUCCESS,
  ERROR,
}

export type Tokens = {
  access_token: string;
  refresh_token: string;
};
export const cookieOption: CookieSerializeOptions = {
  domain: process.env.domainclient,
  httpOnly: true,
  secure: false,
  sameSite: 'strict',
  path: '/',
  priority: 'high',
  maxAge: 60 * 60 * 24,
};

export class AuthResponse {
  @ApiProperty({ enum: ResponseTypeEnum, enumName: 'ResponseType' })
  responseType: ResponseTypeEnum;
  @ApiProperty({ type: String })
  message: string;
  @ApiProperty({ type: String })
  refreshToken?: string;
  accessToken?: string;

  @ApiProperty({ type: PartialType(Users) })
  data: Partial<Users>;
}
