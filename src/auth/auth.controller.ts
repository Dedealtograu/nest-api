import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthLoginDto } from './dto/auth-login.dto'
import { AuthRegisterDto } from './dto/auth-register.dto'
import { AuthForgetDto } from './dto/auth-forget.dto'
import { AuthResetDto } from './dto/auth-reset.dto'
import { UserService } from 'src/user/user.service'
import { AuthService } from './auth.service'
import { AuthGuard } from 'src/guards/auth.guard'
import { User } from 'src/decorators/user.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { join } from 'path'
import { FileService } from 'src/file/file.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDto) {
    return this.authService.login(email, password)
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body)
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDto) {
    return this.authService.forget(email)
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDto) {
    return this.authService.reset(password, token)
  }

  @UseGuards(AuthGuard)
  @Post('me')
  me(@User() user: CreateUserDto) {
    return { user }
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    // eslint-disable-next-line
    const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.jpg`)

    try {
      await this.fileService.upload(photo, path)
    } catch (e) {
      throw new BadRequestException(e)
    }

    return { success: true }
  }

  // @UseInterceptors(FilesInterceptor('files'))
  // @UseGuards(AuthGuard)
  // @Post('files')
  // async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
  //   return files
  // }

  // @UseInterceptors(FileFieldsInterceptor([{ name: 'files1' }, { name: 'files2' }]))
  // @UseGuards(AuthGuard)
  // @Post('files-fields')
  // async uploadFilesFields(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
  //   return files
  // }
}
