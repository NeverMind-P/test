import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MaxLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'email' })
  @IsEmail()
  @MaxLength(50)
  @Matches(/^[\w\.\-]{4,}@.*$/, { message: 'Email must contain 4 characters' })
  readonly email: string;

  @ApiProperty({ example: 'test1!qQe', description: 'password' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must contain min 8, max 50 symbols, one big, one small letter, one number, and one special character',
  })
  readonly password: string;
}
