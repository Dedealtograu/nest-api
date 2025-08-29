import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PrismaService } from '../prisma/prisma.service'
import { UpdatePutUserDto } from './dto/update-put-user.dto'
import { UpdatePatchUserDto } from './dto/update-patch-user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({ data })
  }

  async list() {
    return this.prisma.user.findMany()
  }

  async findById(id: number) {
    await this.exists(id)
    return this.prisma.user.findUnique({ where: { id } })
  }

  async update(id: number, { name, email, password, birthAt }: UpdatePutUserDto) {
    await this.exists(id)
    return this.prisma.user.update({
      data: {
        name,
        email,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
      },
      where: { id },
    })
  }

  async updatePartial(id: number, { name, email, password, birthAt }: UpdatePatchUserDto) {
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

    if (password) {
      // eslint-disable-next-line
      data.password = password
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
