import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { IExpressRequest } from '../../types/expressRequest.interface';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;

      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;
      const user = await this.userService.findByUserName(decoded.userName);
      req.user = user;
    } catch (error) {
      req.user = null;
    } finally {
      next();
    }
  }
}
