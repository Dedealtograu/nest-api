import { Body, Controller, Param, Post, Put, Patch, Delete, ParseIntPipe } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() {name, email, password}: CreateUserDto) {
    return {name, email, password}
  }
  @Put(':id')
  async update(@Body() { email, name, password }: UpdatePutUserDto, @Param('id', ParseIntPipe) id: number) {
    return {
      method: 'PUT',
      email, name, password,
      id,
    }
  }

  @Patch(':id')
  async updatePrtial(@Body() { email, name, password }: UpdatePatchUserDto, @Param('id', ParseIntPipe) id: number) {
    return {
      method: 'PATCH',
      email, name, password,
      id,
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return { id }
  }
}
