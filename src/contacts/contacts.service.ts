import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactModel } from './contacts.schema';
import { CreateContactDTO, UpdateContactDTO } from './dto/contacts.dto';

@Injectable()
export class ContactsService {
  constructor(@InjectModel(Contact.name) private contactModel: ContactModel) {}

  async create(createContactDto: CreateContactDTO & { owner: string }) {
    const createdContact = new this.contactModel(createContactDto);
    return await createdContact.save();
  }

  async createBulk(contacts: CreateContactDTO[]) {
    return await this.contactModel.insertMany(contacts);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactModel.find();
  }

  async findOne(filter: Partial<Contact>): Promise<Contact> {
    return await this.contactModel.findOne(filter);
  }

  async update(
    id: Partial<Contact>['_id'],
    updateContactDto: UpdateContactDTO
  ) {
    return await this.contactModel.findByIdAndUpdate(id, updateContactDto, {
      new: true,
      runValidators: true
    });
  }

  async findOneAndUpdate(
    filter: Partial<Contact>,
    updateContactDto: UpdateContactDTO
  ) {
    return await this.contactModel.findOneAndUpdate(filter, updateContactDto, {
      new: true,
      runValidators: true
    });
  }

  async delete(id: Partial<Contact>['_id']): Promise<Contact> {
    return await this.contactModel.findByIdAndDelete(id);
  }

  async isValidPhoneNumber(phoneNumber: string) {
    let temp = phoneNumber;
    if (phoneNumber.startsWith('+')) {
      temp = phoneNumber.slice(1);
    }
    const striped = temp
      .replaceAll(' ', '')
      .replaceAll('-', '')
      .replaceAll('(', '')
      .replaceAll(')', '')
      .trim();

    const cleanNumber = Number(striped);

    if (typeof cleanNumber === 'number' && !isNaN(cleanNumber)) {
      return true;
    }
    throw new BadRequestException(
      'Invalid phone number. The number is not a valid number'
    );
  }
}
