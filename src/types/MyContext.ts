import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export type AuthPayload = {
  userId: number;
  userRole: string;
} extends JwtPayload ? JwtPayload : never;

export interface MyContext {
  req: Request;
  res: Response;
  payload: AuthPayload;
}
