import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    // Get request obj from context
    const request = context.switchToHttp().getRequest();

    // Get userId from session
    const { userId } = request.session || {};

    // Find the user from id
    if (userId) {
      request.currentUser = await this.usersService.findOne(userId);
    }

    return handler.handle();
  }
}
