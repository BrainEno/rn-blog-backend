import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { compare, hash } from "bcryptjs";
import User from "../entity/User";
import { MyContext } from "../types/MyContext";
import { isAuth } from "../middleware/isAuth";
import { createAccessToken, createRefreshToken } from "../auth";
import { sendRefreshtoken } from "../sendRefreshToken";
import { getConnection } from "typeorm";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Welcome!";
  }

  //查找所有用户
  @Query(() => [User])
  users() {
    return User.find();
  }

  //注册
  @Mutation(() => Boolean)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        username,
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  //通过增加token版本，来撤销Refreshtoken
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Arg("userId", () => Number) userId: number
  ) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  //登录
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    //通过邮箱验证用户存在
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("该邮箱尚未注册,请先注册");
    }

    //验证密码
    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("密码错误，请重新输入");
    }

    //登录成功

    sendRefreshtoken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  //查看当前用户
  @Query(() => User)
  @UseMiddleware(isAuth)
  async currentUser(@Ctx() { payload }: MyContext) {
    const currentUser = await User.findOne({ id: payload!.userId });

    if (!currentUser) {
      return "暂无用户";
    } else {
      return currentUser;
    }
  }
}
