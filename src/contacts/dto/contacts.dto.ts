import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateContactDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  phone: string;
}

export class _UpdateContactDTO extends PartialType(CreateContactDTO) {}

export class UpdateContactDTO extends PartialType(_UpdateContactDTO) {}
