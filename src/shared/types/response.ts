import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponse {
  @ApiProperty({ example: HttpStatus.UNAUTHORIZED, type: 'number' })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized', type: 'string' })
  message: string;
}

export class BadRequestExceptionResponse {
  @ApiProperty({ example: 'Internal server error', type: 'string' })
  message: string;

  @ApiProperty({ example: HttpStatus.INTERNAL_SERVER_ERROR, type: 'number' })
  statusCode: number;
}
