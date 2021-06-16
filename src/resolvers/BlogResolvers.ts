import { AuthenticationError } from "apollo-server-errors";
import { isEmpty } from "class-validator";
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getRepository } from "typeorm";
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
  async updateBlog(
    @Ctx() { payload }: MyContext,
    @Arg("oldTitle") oldTitle: string,
    @Arg("newTitle") newTitle: string,
    @Arg("newBody") newBody: string,
    @Arg("newDesc") newDesc?: string
  ) {
    const owner = await User.findOneOrFail({ id: payload?.userId });
    if (!owner) throw new AuthenticationError("认证失败,无法编辑此文章");
    try {
      let errors: any = {};
      if (isEmpty(oldTitle)) errors.oldName = "请输入要编辑的文章标题";
      if (isEmpty(newBody)) errors.newBody = "文章内容不得为空";
      if (isEmpty(newTitle)) errors.newTitle = "文章标题不得为空";
      if (isEmpty(newDesc)) errors.desc = "文章简介不得为空";
      let blogToUpd = await getRepository(Blog)
        .createQueryBuilder("blog")
        .where("lower(blog.title)=:oldTitle", {
          oldTitle: oldTitle.toLowerCase(),
        })
        .getOne();

      if (!blogToUpd) errors.title = "未找到改标题的文章";

      blogToUpd!.title = newTitle;
      blogToUpd!.body = newBody;
      blogToUpd!.desc = newDesc || newBody.trim().slice(0, 45);

      await blogToUpd!.save();
      return blogToUpd;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  //删除博客
  @UseMiddleware(isAuth)
  @Mutation(() => Blog)
  async deleteBlog(@Ctx() { payload }: MyContext, @Arg("id") id: number) {
    const owner = await User.findOneOrFail({ id: payload?.userId });
    if (!owner) throw new AuthenticationError("认证失败,没有权限删除文章");

    try {
      let errors: any = {};
      if (isEmpty(id)) errors.id = "请选择要删除的文章";

      let blogToDel = await Blog.findOneOrFail(id);
      if (!blogToDel) errors.blog = "您要删除的文章不存在，请重新选择";
      if (Object.keys(errors).length > 0) {
        throw errors;
      }
      try {
        const deletedBlog = await blogToDel!.remove();
        return deletedBlog;
      } catch (err) {
        return err;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
