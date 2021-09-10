import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { createAccessToken, createRefreshToken } from './auth';
import User from './entities/User';

const sendRefreshtoken = (res: Response, token: string) => {
  res.cookie('bot', token, {
    httpOnly: true
  });
};

const sendRefreshTokenController = async (req: Request, res: Response) => {
  const token = req.cookies.bot;
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

  // 如果token有效, 发送一个访问许可;
  const user = await User.findOne({ id: payload.userId });

  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  sendRefreshtoken(res, createRefreshToken(user));

  return res.send({ ok: true, accessToken: createAccessToken(user) });
};

const _ = { sendRefreshTokenController, sendRefreshtoken };
export default _;
