import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/decorators/roles.decorator'
import { Role } from 'src/enums/role.enums'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    // eslint-disable-next-line
    const requeridRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

    if (!requeridRoles) {
      return true
    }
    // eslint-disable-next-line
    const { user } = context.switchToHttp().getRequest()
    // eslint-disable-next-line
    const roleFiltered = requeridRoles.filter(role => role === user.role)

    return roleFiltered.length > 0
  }
}
