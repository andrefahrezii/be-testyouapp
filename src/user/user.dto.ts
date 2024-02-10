import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  birthday: string;

  @ApiProperty()
  height: number;

  @ApiProperty()
  weight: number;

  @ApiProperty({
    type: [String],
  })
  interests: string[];

  @ApiProperty({ required: false })
  photoprofile?: string;

  @ApiProperty({ required: false })
  galery?: string[];
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  birthday?: string;

  @ApiProperty({ required: false })
  height?: number;

  @ApiProperty({ required: false })
  weight?: number;

  @ApiProperty({
    type: [String],
    required: false,
  })
  interests?: string[];
}
