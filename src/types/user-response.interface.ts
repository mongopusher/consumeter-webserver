import { TUser } from '@webserver/types/user.type';

export interface IUserResponse {
  user: TUser & { token: string };
}
