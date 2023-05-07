import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserRoles } from '../shared/types/enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  async findByAnyKeyValue(
    key: keyof User,
    value: string | number,
  ): Promise<User> {
    return this.userRepository.findOne({ where: { [key]: value } });
  }

  async findBoss(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id, role: UserRoles.BOSS } });
  }

  async findAll(
    role: UserRoles,
    id: string,
  ): Promise<User[] | { boss: User; subordinates: User[] }> {
    switch (role) {
      case UserRoles.ADMIN:
        return this.userRepository.findAll();
      case UserRoles.BOSS:
        const boss = await this.userRepository.findOne({ where: { id } });
        const subordinates = await this.userRepository.findAll({
          where: { boss_id: id },
        });
        return { boss, subordinates };
      default:
        return this.userRepository.findAll({
          where: { id },
        });
    }
  }

  async update({
    userId,
    updateUserDto,
    bossId,
  }: {
    userId: string;
    updateUserDto: UpdateUserDto;
    bossId: string;
  }) {
    const user = await this.userRepository.findOne({ where: { id: bossId } });
    if (user.role === UserRoles.BOSS) {
      throw new BadRequestException('Boss can not change info for boss');
    }
    const subordinate = await this.userRepository.findOne({
      where: { id: userId, boss_id: bossId },
    });
    if (subordinate) {
      throw new BadRequestException('User not found');
    }
    if (updateUserDto.password) {
      const hashPassword = await bcrypt.hash(updateUserDto.password, 5);
      updateUserDto.password = hashPassword;
    }
    await this.userRepository.update(updateUserDto, { where: { id: userId } });
  }
}
