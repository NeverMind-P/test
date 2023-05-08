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
        const bossAndSubordinates = await this.userRepository.findAll({
          where: { id },
          include: [
            {
              model: this.userRepository,
              as: 'subordinates',
              where: { boss_id: id },
              required: false,
            },
          ],
        });
        return bossAndSubordinates;
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
    const [boss, user] = await Promise.all([
      this.userRepository.findOne({ where: { id: bossId } }),
      this.userRepository.findOne({ where: { id: userId } }),
    ]);

    if (boss.role !== UserRoles.BOSS) {
      throw new BadRequestException('Boss can be user with role boss');
    }
    if (user.role === UserRoles.BOSS) {
      throw new BadRequestException('Boss can not change info for boss');
    }
    const subordinate = await this.getSubordinates(bossId, userId);
    if (subordinate) {
      throw new BadRequestException('User not found');
    }
    if (updateUserDto.password) {
      const hashPassword = await bcrypt.hash(updateUserDto.password, 5);
      updateUserDto.password = hashPassword;
    }
    await this.userRepository.update(updateUserDto, { where: { id: userId } });
  }

  async getSubordinates(bossId: string, userId: string): Promise<User[]> {
    const subordinates = await this.userRepository.findAll({
      where: { boss_id: bossId, id: userId },
    });

    const promises = subordinates.map((subordinate) =>
      this.getSubordinates(subordinate.id, userId),
    );
    const nestedSubordinates = await Promise.all(promises);
    return subordinates.concat(...nestedSubordinates);
  }
}
