import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { MyContext } from '../types/MyContext';

export const isAdmin: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers.authorization;

  if (!authorization) {
    throw new Error('Not Authenticated');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
    if (!context.payload?.userRole.includes('ADMIN')) {
      throw new Error('Not Admin User');
    }
  } catch (err) {
    console.log(err);
    throw new Error('Not Admin User');
  }

  return next();
};
