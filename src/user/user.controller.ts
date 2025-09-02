import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Param,
  Put,
  Patch,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'
import { UpdatePutUserDto } from './dto/update-put-user.dto'
import { UpdatePatchUserDto } from './dto/update-patch-user.dto'
import { LogInterceptor } from '../interceptors/log.interceptor'
import { ParamId } from '../decorators/param-id.decorator'
import { Role } from 'src/enums/role.enums'
import { Roles } from 'src/decorators/roles.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin, Role.User)
  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data)
  }

  @Roles(Role.Admin, Role.User)
  @Get()
  async list() {
    return this.userService.list()
  }

  @Get(':id')
  async findOne(@ParamId() id: number) {
    return this.userService.findById(id)
  }

  @Roles(Role.Admin, Role.User)
  @Put(':id')
  async update(@Body() data: UpdatePutUserDto, @Param('id', ParseIntPipe) id: number) {
    return this.userService.update(id, data)
  }

  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchUserDto, @Param('id', ParseIntPipe) id: number) {
    console.log(data)
    return this.userService.updatePartial(id, data)
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id)
  }
}
