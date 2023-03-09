import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Users {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  fullName: string;

  @ApiProperty({ type: String })
  phoneNumber: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiPropertyOptional({ type: String })
  biography?: string;

  @ApiPropertyOptional({ type: String })
  refreshToken?: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}