import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from '../../shared/types/enums';

@Injectable()
export class JWTUtil {
  constructor(private readonly jwtService: JwtService) {}

  decode(auth: string): { role: UserRoles; id: string } {
    const jwt = auth.replace('Bearer ', '');
    return this.jwtService.decode(jwt, { json: true }) as {
      role: UserRoles;
      id: string;
    };
  }
}
