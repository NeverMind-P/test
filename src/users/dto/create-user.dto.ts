import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { UserRoles } from '../../shared/types/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  @IsEmail()
  @MaxLength(50)
  @Matches(/^[\w\.\-]{4,}@.*$/, { message: 'Email must contain 4 characters' })
  email: string;

  @ApiProperty({
    example: 'Alex',
    description: 'First Name',
  })
  @IsString()
  @Length(2, 50)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  first_name: string;

  @ApiProperty({
    example: 'Boiko',
    description: 'Last Name',
  })
  @IsString()
  @Length(2, 50)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  last_name: string;

  @ApiProperty({ example: 'test1!qQe', description: 'password' })
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must contain min 8, max 50 symbols, one big, one small letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({ example: UserRoles.USER, description: 'Users role' })
  @IsEnum(UserRoles)
  role: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Boss ID',
  })
  @IsUUID()
  @IsOptional()
  boss_id: string;
}
