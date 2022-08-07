import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IExpressRequest } from '@webserver/types/express-request.interface';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@webserver/config';
import { UserService } from '@webserver/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  public constructor(private readonly userService: UserService) {}

  public async use(
    req: IExpressRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = verify(token, JWT_SECRET) as any;
      req.user = await this.userService.getById(decoded.id);
      next();
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(`Error while parsing token! [${token}]`);
      } else if (error instanceof TokenExpiredError) {
        console.error(`Session is outdated! [expiredAt: ${error.expiredAt}]`);
      } else {
        console.error('An unknown error occured while fetching user from token', error);
      }
      req.user = null;
      next();
    }
  }
}
