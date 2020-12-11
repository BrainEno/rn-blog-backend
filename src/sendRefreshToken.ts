import { Response } from "express";

export const sendRefreshtoken = (res: Response, token: string) => {
  res.cookie("bot", token, {
    httpOnly: true,
  });
};
