import User from './entities/User';
import { sign } from 'jsonwebtoken';

export const createAccessToken = (user: User) => {
  return sign(
    {
      userId: user.id,
      tokenVersion: user.tokenVersion,
      userRole: user.userRole
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '15m' //15分钟过期
    }
  );
};

export const createRefreshToken = (user: User) => {
  return sign(
    {
      userId: user.id,
      tokenVersion: user.tokenVersion,
      userRole: user.userRole
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d'
    }
  );
};
