import { Request } from 'express';
import { UserEntity } from '@webserver/user/user.entity';

export interface IExpressRequest extends Request {
  user?: UserEntity;
}
