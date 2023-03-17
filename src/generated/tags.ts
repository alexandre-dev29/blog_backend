import { Posts } from './posts';
import { ApiProperty } from '@nestjs/swagger';

export class Tags {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  tagName: string;

  @ApiProperty({ isArray: true, type: () => Posts })
  Aticles: Posts[];

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
