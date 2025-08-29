import { Body, Controller, Get, ParseIntPipe, Post, Param, Put, Patch, Delete, UseInterceptors } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'
import { UpdatePutUserDto } from './dto/update-put-user.dto'
import { UpdatePatchUserDto } from './dto/update-patch-user.dto'
import { LogInterceptor } from '../interceptors/log.interceptor'
import { ParamId } from '../decorators/param-id.decorator'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(LogInterceptor)
  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data)
  }

  @Get()
  async list() {
    return this.userService.list()
  }

  @Get(':id')
  async findOne(@ParamId() id: number) {
    return this.userService.findById(id)
  }

  @Put(':id')
  async update(@Body() data: UpdatePutUserDto, @Param('id', ParseIntPipe) id: number) {
    return this.userService.update(id, data)
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchUserDto, @Param('id', ParseIntPipe) id: number) {
    return this.userService.updatePartial(id, data)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id)
  }
}
