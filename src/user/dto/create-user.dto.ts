import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from 'class-validator'
import { Role } from 'src/enums/role.enums'

export class CreateUserDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsDateString()
  birthAt: string

  @IsOptional()
  @IsEnum(Role)
  role: number

  @IsStrongPassword({
    minLength: 6,
  })
  password: string
}
