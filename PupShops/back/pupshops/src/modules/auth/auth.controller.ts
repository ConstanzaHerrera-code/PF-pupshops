/* eslint-disable no-unused-vars */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseInterceptors,
  Req,
} from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './loginUserDto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  @HttpCode(201)
  /* @UseInterceptors(DateAdderInterceptor) */
  async signUp(
    @Body() user: CreateUserDto,
    @Req() request: Request & { now: string },
  ) {
    console.log('Usuario creado a las: ', request.now);
    const nuevoUsuario = await this.authService.signUp(user);
    return plainToClass(CreateUserDto, nuevoUsuario, {
      excludeExtraneousValues: true,
    });
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body() login: LoginUserDto) {
    return this.authService.signIn(login);
  }
}
