import { TUser } from '@webserver/user/types/user.type';

export interface IUserResponse {
  user: TUser & {
    token: string;
    expiresIn: number;
  };
}
