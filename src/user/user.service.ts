import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PrismaService } from '../prisma/prisma.service'
import { UpdatePutUserDto } from './dto/update-put-user.dto'
import { UpdatePatchUserDto } from './dto/update-patch-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())

    return this.prisma.user.create({ data })
  }

  async list() {
    return this.prisma.user.findMany()
  }

  async findById(id: number) {
    await this.exists(id)
    return this.prisma.user.findUnique({ where: { id } })
  }

  async update(id: number, { name, email, password, birthAt, role }: UpdatePutUserDto) {
    await this.exists(id)

    password = await bcrypt.hash(password, await bcrypt.genSalt())

    return this.prisma.user.update({
      data: {
        name,
        email,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
        role,
      },
      where: { id },
    })
  }

  async updatePartial(id: number, { name, email, password, birthAt, role }: UpdatePatchUserDto) {
    await this.exists(id)
    const data: any = {}

    if (birthAt) {
      // eslint-disable-next-line
      data.birthAt = new Date(birthAt)
    }

    if (name) {
      // eslint-disable-next-line
      data.name = name
    }

    if (email) {
      // eslint-disable-next-line
      data.email = email
    }

    if (role) {
      console.log(role)
      // eslint-disable-next-line
      data.role = role
    }

    if (password) {
      // eslint-disable-next-line
      data.password = await bcrypt.hash(password, await bcrypt.genSalt())
    }

    return this.prisma.user.update({
      // eslint-disable-next-line
      data,
      where: { id },
    })
  }

  async delete(id: number) {
    await this.exists(id)
    return this.prisma.user.delete({ where: { id } })
  }

  async exists(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuário do id ${id} não existe`)
    }
  }
}
