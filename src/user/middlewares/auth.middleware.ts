import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IExpressRequest } from '@webserver/types/express-request.interface';
import { JsonWebTokenError, TokenExpiredError, verify } from 'jsonwebtoken';
import { UserService } from '@webserver/user/user.service';
import * as fs from 'fs';

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

    let publicRS256Key;
    try {
      publicRS256Key = await fs.promises.readFile('./resources/public.key');
    } catch (e) {
      console.error(`Error while reading public key!`, e);
    }

    try {
      const decoded = verify(token, publicRS256Key, { algorithms: ['RS256'] }) as any;
      req.user = await this.userService.getById(decoded.id);
      next();
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(`Error while parsing token! [${token}]`);
      } else if (error instanceof TokenExpiredError) {
        console.error(`Session is outdated! [expiredAt: ${error.expiredAt}]`);
      } else if (error instanceof JsonWebTokenError) {
        console.error('Token is missing!', error);
      } else {
        console.error('An unknown error occured while fetching user from token', error);
      }
      req.user = null;
      next();
    }
  }
}
