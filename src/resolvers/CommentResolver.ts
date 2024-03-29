import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import Comment from '../entities/Comment';
import { AuthenticationError } from 'apollo-server-express';
import User from '../entities/User';
import { MyContext } from '../types/MyContext';
import Blog from '../entities/Blog';
import { isEmpty } from 'class-validator';

@Resolver()
export class CommentResolver {
  //添加评论
  @UseMiddleware(isAuth)
  @Mutation(() => Comment)
  async newComment(
    @Arg('blogIdentifier') blogIdentifier: string,
    @Arg('content') content: string,
    @Ctx() { payload }: MyContext
  ) {
    const user = await User.findOneBy({ id: payload!.userId });
    if (!user) throw new AuthenticationError('认证失败');

    const blog = await Blog.findOneByOrFail({ identifier: blogIdentifier });
    if (!blog) throw new Error('不可评论该文章，请重试');

    if (isEmpty(content)) throw new Error('评论内容不得为空');

    try {
      const comment = Comment.create({ content, blog, user });
      await comment.save();
      return comment;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //编辑评论
  @UseMiddleware(isAuth)
  @Mutation(() => Comment)
  async editComment(
    @Ctx() { payload }: MyContext,
    @Arg('identifier') identifier: string,
    @Arg('newContent') newContent: string
  ) {
    const user = await User.findOneBy({ id: payload!.userId });
    if (!user) throw new AuthenticationError('认证失败');

    const commentToEdt = await Comment.findOneByOrFail({ identifier });
    if (!commentToEdt) throw new Error('无法编辑该评论，请重试');

    if (isEmpty(newContent)) throw new Error('输入内容不得为空');

    commentToEdt.content = newContent;

    try {
      const editedComment = await commentToEdt.save();
      return editedComment;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //删除评论
  @UseMiddleware(isAuth)
  @Mutation(() => Comment)
  async removeComment(
    @Arg('identifier') identifier: string,
    @Ctx() { payload }: MyContext
  ) {
    const user = await User.findOneBy({ id: payload!.userId });
    if (!user) throw new AuthenticationError('认证失败');

    const commentToRm = await Comment.findOneByOrFail({ identifier });
    if (!commentToRm) throw new Error('无法删除该评论，请重试');

    try {
      const RemovedComment = await commentToRm.remove();
      return RemovedComment;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
