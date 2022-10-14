import { Auth } from '@/common/decorators/http.decorator';
import { Roles } from '@/users/user.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { Contact } from './contacts.schema';
import { CreateContactDTO, UpdateContactDTO } from './dto/contacts.dto';
import {
  ContactResponseDTO,
  CreateContactResponseTypeDto
} from './dto/contacts.response.dto';
import { CurrentUser } from '@/common/decorators/user.decorator';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Endpoint for creating a new Contact' })
  @ApiCreatedResponse({
    description: 'Contact creation was success',
    type: ContactResponseDTO
  })
  @ApiConflictResponse({
    description: 'Contact already exists'
  })
  @Auth([Roles.USER])
  async create(
    @Body() body: CreateContactDTO,
    @CurrentUser('_id') userId: string
  ) {
    await this.contactsService.isValidPhoneNumber(body.phone);

    const newContact = await this.contactsService.create({
      ...body,
      owner: userId
    });
    return {
      data: newContact
    };
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint for listing all Contacts' })
  @ApiOkResponse({
    description: 'Contacts successfully listed',
    type: [ContactResponseDTO]
  })
  @Auth([Roles.USER])
  async findAll() {
    const contacts = await this.contactsService.findAll();
    return {
      data: contacts
    };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint for getting a Contact by id' })
  @ApiOkResponse({
    description: 'Contact successfully retrieved',
    type: ContactResponseDTO
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Contact id, e.g. 5f6b4d6b4f9b9c0b8c2d2c2f'
  })
  @Auth([Roles.USER])
  async findById(@Param('id') contactId: Partial<Contact>['_id']) {
    const contact = await this.contactsService.findOne({
      _id: contactId
    });
    return {
      data: contact
    };
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint for updating a Contact by id' })
  @ApiOkResponse({
    description: 'Contact successfully updated',
    type: ContactResponseDTO
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Contact id, e.g. 5f6b4d6b4f9b9c0b8c2d2c2f'
  })
  @Auth([Roles.USER])
  async update(
    @Param('id') contactId: Partial<Contact>['_id'],
    @Body() body: UpdateContactDTO
  ) {
    const contact = await this.contactsService.update(contactId, body);
    return {
      data: contact
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint for deleting a Contact by id' })
  @ApiOkResponse({
    description: 'Contact successfully deleted',
    type: ContactResponseDTO
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Contact id, e.g. 5f6b4d6b4f9b9c0b8c2d2c2f'
  })
  @Auth([Roles.USER])
  async delete(@Param('id') contactId: Partial<Contact>['_id']) {
    const contact = await this.contactsService.delete(contactId);
    return {
      data: contact
    };
  }

  @Post('/create-bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Endpoint for creating bulk Contacts' })
  @ApiCreatedResponse({
    description: 'Contacts creation was success',
    type: [CreateContactResponseTypeDto]
  })
  @ApiConflictResponse({
    description: 'Contact already exists'
  })
  @Auth([Roles.USER])
  async createBulk(
    @Body() body: CreateContactDTO[],
    @CurrentUser('_id') userId: string
  ) {
    // This is an array of promises, we want to make sure that the numbers are valid before creating the contacts
    const _body = await Promise.all(
      body.map(async (contact) => {
        await this.contactsService.isValidPhoneNumber(contact.phone);

        return {
          ...contact,
          owner: userId
        };
      })
    );

    const newContacts = await this.contactsService.createBulk(_body);
    return {
      data: newContacts
    };
  }
}
