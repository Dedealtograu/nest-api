import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((filter: string, context: ExecutionContext) => {
  // eslint-disable-next-line
  const request = context.switchToHttp().getRequest()
  // eslint-disable-next-line
  if (request.user) {
    if (filter) {
      // eslint-disable-next-line
      return request.user[filter]
    } else {
      // eslint-disable-next-line
      return request.user
    }
  } else {
    throw new Error('User not found in request')
  }
})
