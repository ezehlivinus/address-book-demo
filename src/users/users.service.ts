import { CreateUserDTO } from '@/auth/auth.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async findOne(filter: Partial<User>) {
    return await this.userModel.findOne(filter).exec();
  }

  async create(user: CreateUserDTO) {
    return await this.userModel.create(user);
  }
}
