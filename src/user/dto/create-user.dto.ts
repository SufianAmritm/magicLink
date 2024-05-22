import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  oculusId: string;
}

export class MagicLinkDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
export class MagicLinkSignInDto {
  @IsString()
  @IsNotEmpty()
  link: string;
}
