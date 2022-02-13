import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware
} from 'type-graphql';
import { compare, hash } from 'bcryptjs';
import User from '../entities/User';
import { MyContext } from '../types/MyContext';
import { isAuth } from '../middleware/isAuth';
import { createAccessToken, createRefreshToken } from '../auth';
import { setRefreshtoken } from '../sendRefreshToken';
import { getConnection, getRepository } from 'typeorm';
import { AuthenticationError } from 'apollo-server-errors';
import Roles from '../types/Roles';
import { isAdmin } from '../middleware/isAdmin';
import LoginResponse from '../objectTypes/LoginResponse';
import { isEmpty } from 'class-validator';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'Welcome to React Native BOT THK!';
  }

  //仅管理员，查找所有用户
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
      return err;
    }

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

    //登录成功,设置refresh token
    setRefreshtoken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user
    };
  }

  //查看当前用户
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async currUser(@Ctx() { payload }: MyContext): Promise<User | null> {
    const currentUser = await User.findOneOrFail({ id: payload!.userId });

    if (!currentUser) {
      return null;
    } else {
      return currentUser;
    }
  }

  //退出登录
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    if (req.headers.cookie) {
      req.headers.authorization = '';
      res.clearCookie('bot_refresh');

      return true;
    }
    return false;
  }

  //撤销refresh token，仅管理员
  @UseMiddleware(isAdmin)
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Arg('userId', () => Number) userId: number
  ) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);

    return true;
  }

  //关注用户
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async follow(@Ctx() { payload }: MyContext, @Arg('userId') userId: number) {
    if (isEmpty(userId)) throw new Error('该用户不存在');
    try {
      const curUser = await User.findOneOrFail({ id: payload.userId });
      if (!curUser) throw new AuthenticationError('登录过期,请重新登录');
      const toFollow = await User.findOneOrFail({ id: userId });
      if (!toFollow) throw new Error('该用户不存在或已注销');

      const userRepository = getRepository(User);

      if (!curUser.followings) curUser.followings = [];
      if (!toFollow.followers) toFollow.followers = [];

      curUser.followings.push(toFollow);
      toFollow.followers.push(curUser);

      curUser.addFollowingId(toFollow.id.toString());
      toFollow.addFollowerId(curUser.id.toString());

      await userRepository.save(curUser);
      await userRepository.save(toFollow);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  //列出已关注者ID
  @UseMiddleware(isAuth)
  @Query(() => String)
  async listFollowing(@Ctx() { payload }: MyContext) {
    const curUser = await User.findOne({
      where: { id: payload.userId }
    });

    if (!curUser) throw new AuthenticationError('登录过期,请重新登录');

    return curUser.followingIds;
  }

  //列出被关注者Id
  @UseMiddleware(isAuth)
  @Query(() => String)
  async listFollower(@Ctx() { payload }: MyContext) {
    const curUser = await User.findOne({
      where: { id: payload.userId }
    });

    if (!curUser) throw new AuthenticationError('登录过期,请重新登录');

    return curUser.followerIds;
  }
}
