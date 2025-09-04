import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthRegisterDto } from './dto/auth-register.dto'
import * as bcrypt from 'bcrypt'
import { MailerService } from '@nestjs-modules/mailer/dist'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
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

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users',
      },
    )

    await this.mailer.sendMail({
      to: 'dede@email.com',
      subject: 'Redefinição de senha',
      template: 'forget',
      context: {
        name: '',
        token,
      },
    })

    return true
  }

  async reset(password: string, token: string) {
    try {
      // eslint-disable-next-line
      const data: any = this.jwtService.verify(token, {issuer: 'forget', audience: 'users' })
      // eslint-disable-next-line
      if (isNaN(Number(data.id))) {
        throw new UnauthorizedException('Invalid token')
      }

      password = await bcrypt.hash(password, 10)

      const user = await this.prisma.user.update({
        // eslint-disable-next-line
        where: { id: data.id },
        data: { password },
      })

      return this.createToken(user)
    } catch (e) {
      throw new UnauthorizedException(e)
    }
  }

  async register(data: AuthRegisterDto) {
    const user = await this.userService.create(data)
    return this.createToken(user)
  }
}
