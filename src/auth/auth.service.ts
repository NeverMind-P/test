import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(userDto);
    if (user) {
      const accessToken = await this.generateAccessToken({
        id: user.id,
        role: user.role,
      });
      return { accessToken };
    }
    throw new BadRequestException('Something went wrong, please try again!');
  }

  async registration(
    createUserDto: CreateUserDto,
  ): Promise<{ first_name: string; id: string; role: string }> {
    if (createUserDto.boss_id) {
      const boss = await this.userService.findBoss(createUserDto.boss_id);
      if (!boss) {
        throw new BadRequestException('Boss not found');
      }
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 5);
    const { first_name, id, role } = await this.userService.create({
      ...createUserDto,
      password: hashPassword,
    });

    return { first_name, id, role };
  }

  async validateUser(
    userDto: LoginUserDto,
  ): Promise<{ id: string; role: string }> {
    const user = await this.userService.findByAnyKeyValue(
      'email',
      userDto.email,
    );
    if (!user) {
      throw new BadRequestException({
        message: 'Email is incorrect',
      });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!passwordEquals) {
      throw new BadRequestException({
        message: 'Password is incorrect',
      });
    }
    return { id: user.id, role: user.role };
  }

  async generateAccessToken({
    id,
    role,
  }: {
    id: string;
    role: string;
  }): Promise<string> {
    const payload = { id, role };
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET_KEY,
    });
  }
}
