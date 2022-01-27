import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { createAccessToken, createRefreshToken } from './auth';
import User from './entities/User';

export const sendRefreshTokenController = async (
  req: Request,
  res: Response
) => {
  const token = req.cookies.bot_refresh;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload: any = null;

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }

  // 如果refresh token有效, 发送access token
  const user = await User.findOne({ id: payload.userId });

  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  //检验用户账户是否有效
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  //刷新refresh token
  setRefreshtoken(res, createRefreshToken(user));

  return res.send({ ok: true, accessToken: createAccessToken(user) });
};

export const setRefreshtoken = (res: Response, token: string) => {
  res.cookie('bot_refresh', token, {
    httpOnly: true
  });
};
