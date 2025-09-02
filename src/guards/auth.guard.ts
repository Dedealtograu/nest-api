import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    // eslint-disable-next-line
    const request = context.switchToHttp().getRequest()
    // eslint-disable-next-line
    const { authorization } = request.headers

    try {
      // eslint-disable-next-line
      const data = this.authService.checkToken((authorization ?? '').split(' ')[1])
      // eslint-disable-next-line
      request.tokenPayload = data
      // eslint-disable-next-line
      request.user = await this.userService.findById(data.id)

      return true
    } catch {
      return false
    }
  }
}
