import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { UserRoles } from '../../shared/types/enums';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID',
  })
  @Column({
    defaultValue: Sequelize.literal('uuid_generate_v4()'),
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  @Column({ type: DataType.STRING(70), unique: true, allowNull: false })
  email: string;

  @ApiProperty({
    example: 'Alex',
    description: 'First Name',
  })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  first_name: string;

  @ApiProperty({
    example: 'Boiko',
    description: 'Last Name',
  })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  last_name: string;

  @ApiProperty({ example: UserRoles.USER, description: 'Users role' })
  @Column({
    type: DataType.ENUM(...Object.values(UserRoles)),
    allowNull: false,
  })
  role: string;

  @ApiProperty({ example: 'test1!qQe', description: 'password' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Boss ID',
  })
  @Column({
    type: DataType.UUID,
  })
  boss_id: string;
}
