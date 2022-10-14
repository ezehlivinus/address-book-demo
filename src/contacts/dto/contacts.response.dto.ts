import { ApiProperty } from '@nestjs/swagger';
import { CreateContactDTO } from './contacts.dto';

export class CreateContactResponseTypeDto extends CreateContactDTO {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ContactResponseDTO {
  @ApiProperty()
  status: string;

  @ApiProperty({ type: CreateContactResponseTypeDto })
  data: CreateContactResponseTypeDto;
}
