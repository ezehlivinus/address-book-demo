import { UserDTO } from '@/users/user.dto';
import { User } from '@/users/user.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  password: string;
}

class LoginActionDTO {
  @ApiProperty()
  access_token: string;

  @ApiProperty({ type: UserDTO })
  user: UserDTO;
}

export class LoginResponseDTO {
  @ApiProperty()
  status: string;

  @ApiProperty({ type: LoginActionDTO })
  data: LoginActionDTO;
}

export class CreateUserDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}

class _CreateUserResponseDTO extends CreateUserDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}

export class CreateUserResponseDTO {
  @ApiProperty({ type: _CreateUserResponseDTO })
  data: _CreateUserResponseDTO;
}
