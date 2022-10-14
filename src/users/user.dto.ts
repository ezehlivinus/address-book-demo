import { ApiProperty } from '@nestjs/swagger';
import { Roles } from './user.schema';

export class UserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Roles })
  role: string;
}
