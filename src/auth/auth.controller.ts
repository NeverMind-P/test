import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() userDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.login(userDto);
  }

  @Post('/registration')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ first_name: string; id: string; role: string }> {
    return this.authService.registration(createUserDto);
  }
}
