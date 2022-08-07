import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  readonly usernameOrEmail: string;

  @IsNotEmpty()
  readonly password: string;
}
