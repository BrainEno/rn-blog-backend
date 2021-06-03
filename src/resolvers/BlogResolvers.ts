import { AuthenticationError } from "apollo-server-errors";
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import Blog from "../entity/Blog";
import User from "../entity/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types/MyContext";

@Resolver()
export class BlogResolver {
  //新建博客
  @UseMiddleware(isAuth)
  @Mutation(() => Blog)
  async createBlog(
    @Ctx() { payload }: MyContext,
    @Arg("title") title: string,
    @Arg("body") body: string,
    @Arg("desc") desc?: string
  ) {
    const user = await User.findOne({ id: payload!.userId });

    if (!user) throw new AuthenticationError("认证失败，请登录");

    try {
      const createdAt = new Date();
      const blog = new Blog({ user, title, body, desc, createdAt });
      await blog.save();
      return blog;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  //列出所有博客
  @Query(() => [Blog])
  async listAllBlogs() {
    try {
      const blogs = await Blog.find();
      return blogs;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //列出自己的所有文章
  @Authorized()
  @UseMiddleware(isAuth)
  @Query(() => [Blog])
  async getOwnBlogs(@Ctx() { payload }: MyContext) {
    const owner = await User.findOneOrFail({ id: payload?.userId });
    if (!owner) throw new AuthenticationError("认证失败");
    try {
      const blogs = await Blog.find({ where: { user: owner } });
      if (!blogs) throw new Error("您还没有写过文章");
      return blogs;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //更新博客
  @Authorized()
  @UseMiddleware(isAuth)
  @Mutation(() => Blog)
  async updateBlog(@Ctx() { payload }: MyContext) {
    const owner = await User.findOneOrFail();
  }
}
