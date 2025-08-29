import { BadRequestException, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

export class UseIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    console.log('Middleware', 'Antes...')
    if (isNaN(Number(req.params.id)) || Number(req.params.id) <= 0) {
      throw new BadRequestException('Id invalid')
    }
    console.log('Middleware', 'Depois...')
    next()
  }
}
