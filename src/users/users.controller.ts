import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JWTUtil } from '../auth/decorators/jwt-decode.decorator';
import { AuthorizationToken } from '../decorators/getAuthorizationToken.decorator';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { UserRoles } from '../shared/types/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  BadRequestExceptionResponse,
  UnauthorizedResponse,
} from '../shared/types/response';
import { Response } from 'express';

@ApiInternalServerErrorResponse({ type: BadRequestExceptionResponse })
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: User, isArray: true })
  @Get()
  async findAll(
    @AuthorizationToken('Authorization') jwtToken: string,
  ): Promise<User[] | { boss: User; subordinates: User[] }> {
    const { role, id } = this.jwtUtil.decode(jwtToken);
    return this.usersService.findAll(role, id);
  }

  @Roles(UserRoles.BOSS)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user data' })
  @Patch(':userId')
  async update(
    @Res() res: Response,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @AuthorizationToken('Authorization') jwtToken: string,
  ) {
    const { id } = this.jwtUtil.decode(jwtToken);

    await this.usersService.update({ userId, updateUserDto, bossId: id });
    res.send({ message: 'Successfully updated' });
  }
}
