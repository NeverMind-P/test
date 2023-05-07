import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthorizationToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.authorization;
  },
);
