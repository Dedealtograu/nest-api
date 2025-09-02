import { IsEmail, MinLength } from 'class-validator'

export class AuthLoginDto {
  @IsEmail()
  email: string
  @MinLength(6)
  password: string
}
