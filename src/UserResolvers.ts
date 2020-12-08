import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
} from "type-graphql";
import { compare, hash } from "bcryptjs";
import { User } from "./entity/User";
import { sign } from "jsonwebtoken";
import { MyContext } from "./types/MyContext";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi boy";
  }

  //查找用户
  @Query(() => [User])
  users() {
    return User.find();
  }

  //注册
  @Mutation(() => Boolean)
  async register(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        name,
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  //登录
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    //验证用户存在
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

    res.cookie(
      "bot",
      sign({ userId: user.id }, `${process.env.COOKIE}`, { expiresIn: "7d" }),
      { httpOnly: true }
    );

    return {
      accessToken: sign({ userId: user.id }, `${process.env.TOKEN}`, {
        expiresIn: "15m",
      }),
    };
  }
}
