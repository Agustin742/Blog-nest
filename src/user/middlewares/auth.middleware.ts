import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { UserService } from '../user.service';
import { AuthRequest } from 'src/types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { JwtUserPayload } from 'src/types/jwtPayload.interface';
import { UserEntity } from '../user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = new UserEntity();
      next();
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, secret) as JwtUserPayload;
      const user = await this.userService.findById(decode.id);
      req.user = user;
      next();
    } catch {
      req.user = new UserEntity();
      next();
    }
  }
}
