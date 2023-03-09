import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: String })
  fullName: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: String })
  email: string;
}
