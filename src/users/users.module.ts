import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { JWTUtil } from '../auth/decorators/jwt-decode.decorator';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([User]), JwtModule],
  controllers: [UsersController],
  providers: [UsersService, JWTUtil],
  exports: [UsersService],
})
export class UsersModule {}
