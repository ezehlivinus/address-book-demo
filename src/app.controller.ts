import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('ping')
export class AppController {
  @Get('/ping')
  ping() {
    return { message: 'Server is up' };
  }
}
