import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware
} from 'type-graphql';
import { compare, hash } from 'bcryptjs';
import User from '../entities/User';
import { MyContext } from '../types/MyContext';
import { isAuth } from '../middleware/isAuth';
import { createAccessToken, createRefreshToken } from '../auth';
import { sendRefreshtoken } from '../sendRefreshToken';
import { getConnection } from 'typeorm';
import { AuthenticationError } from 'apollo-server-errors';
import Roles from '../types/Roles';
import { isAdmin } from '../middleware/isAdmin';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'Welcome to React Native BOT THK!';
  }

  //查找所有用户
  @UseMiddleware(isAdmin)
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  //注册
  @Mutation(() => Boolean)
  async register(
    @Arg('username') username: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<boolean> {
    //验证邮箱是否已被注册
    const exist = await User.findOne({ where: { email }, select: ['id'] });
    if (exist) {
      throw new AuthenticationError('该邮箱已被注册，请更换邮箱或找回密码');
    }

    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        username,
        email,
        password: hashedPassword,
        userRole: Roles.AUTH_USER
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  //如有需要可通过增加token版本，来撤销refreshtoken
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Arg('userId', () => Number) userId: number
  ) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);

    return true;
  }

  //登录
  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    //通过邮箱验证用户存在
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new AuthenticationError('该邮箱尚未注册,请先注册');
    }

    //验证密码
    const valid = await compare(password, user.password);

    if (!valid) {
      throw new AuthenticationError('密码错误，请重新输入');
    }

    //登录成功
    sendRefreshtoken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user
    };
  }

  //查看当前用户
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async currUser(@Ctx() { payload }: MyContext): Promise<User | null> {
    const currentUser = await User.findOne({ id: payload!.userId });

    if (!currentUser) {
      return null;
    } else {
      return currentUser;
    }
  }

  //退出登录
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!ctx.req.headers.authorization) reject(false);
      ctx.req.headers.authorization = '';
      ctx.res.clearCookie('bot');
      return resolve(true);
    });
  }
}
