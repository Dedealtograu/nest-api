import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const ParamId = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  // eslint-disable-next-line
  return Number(context.switchToHttp().getRequest().params.id)
})
