import { Controller, Post, Body } from '@nestjs/common';
import { ApiService } from './user.service';
import {
  CreateUserDto,
  MagicLinkDto,
  MagicLinkSignInDto,
} from './dto/create-user.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        pass: { type: 'string' },
        oculusId: { type: 'string' },
      },
    },
  })
  @Post()
  async create(@Body() createApiDto: CreateUserDto) {
    return await this.apiService.singUp(createApiDto);
  }
  @ApiOperation({ summary: 'Send magic link' })
  @ApiBody({
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
    },
  })
  @Post('magic')
  async createLink(@Body() data: MagicLinkDto) {
    return await this.apiService.createMagicLink(data.email);
  }
  @ApiOperation({ summary: 'Sing in with magic link' })
  @ApiBody({
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        link: { type: 'string' },
      },
    },
  })
  @Post('magic/signIn')
  async signInWithMagicLink(@Body() data: MagicLinkSignInDto) {
    return await this.apiService.loginWithMagic(data.link);
  }
}
