import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  readonly userName: string;

  @IsEmail()
  readonly email: string;

  readonly password: string;

  readonly roleId: number;
}
