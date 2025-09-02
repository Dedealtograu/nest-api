import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthRegisterDto } from './dto/auth-register.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        { id: user.id, name: user.name, email: user.email },
        { expiresIn: '7d', subject: String(user.id), issuer: 'login', audience: 'users' },
      ),
    }
  }

  checkToken(token: string) {
    try {
      // eslint-disable-next-line
      const data = this.jwtService.verify(token, {issuer: 'login', audience: 'users' })
      // eslint-disable-next-line
      return data
    } catch (e) {
      throw new UnauthorizedException(e)
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token)
      return true
    } catch {
      return false
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email } })
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return this.createToken(user)
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } })
    if (!user) {
      throw new UnauthorizedException('Email not found')
    }
    // TODO: send email
    return true
  }
  // eslint-disable-next-line
  async reset(password: string, token: string) {
    // TODO: verify token

    const id = 0
    const user = await this.prisma.user.update({
      where: { id },
      data: { password },
    })

    return this.createToken(user)
  }

  async register(data: AuthRegisterDto) {
    const user = await this.userService.create(data)
    return this.createToken(user)
  }
}
