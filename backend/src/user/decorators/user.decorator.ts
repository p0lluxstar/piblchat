import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IExpressRequest } from '../../types/expressRequest.interface';

export const UserDecorator = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<IExpressRequest>();

  console.log('request.user', request.user);

  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
