import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, CreateUserDTO } from './auth.dto';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(payload: { email: string }) {
    const user = await this.userService.findOne({ email: payload.email });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
  async login(body: LoginDTO) {
    const { email, password } = body;

    const user = await this.userService.findOne({ email });

    if (_.isEmpty(user)) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);

    console.log(isMatch, user)

    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign({ email });

    return {
      data: { ...user.toJSON(), access_token: accessToken }
    };
  }

  async auth(body: CreateUserDTO) {
    const { email, password } = body;

    const user = await this.userService.findOne({ email });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const newUser = await this.userService.create({
      email,
      password
    });

    const token = await this.jwtService.signAsync(
      {
        email,
        _id: newUser._id
      },
      {
        expiresIn: '24h',
        algorithm: 'HS512',
        secret: this.configService.get('JWT_SECRET')
      }
    );

    return {
      data: newUser,
      access_token: token
    };
  }
}
