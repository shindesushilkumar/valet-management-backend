import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface AuthenticatedUser {
  id: number;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (
    _data: unknown,
    context: ExecutionContext,
  ): AuthenticatedUser | undefined => {
    const request: { user?: AuthenticatedUser } = context
      .switchToHttp()
      .getRequest();
    return request.user;
  },
);
