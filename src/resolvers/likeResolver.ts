import { AuthenticationError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import Blog from '../entities/Blog';
import Like from '../entities/Like';
import User from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/MyContext';

@Resolver()
export class LikeResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Like)
  async AddLike(@Ctx() { payload }: MyContext, @Arg('blogId') blogId: number) {
    const user = await User.findOneBy({ id: payload!.userId });

    if (!user) throw new AuthenticationError('认证失败,无法收藏文章');

    try {
      const blog = await Blog.findOneBy({ id: blogId });
      if (!blog) throw new Error('无法找到该文章，请重试');

      const like = await Like.findOneBy({ likedBy: user.username, blogId });

      if (!like) {
        const newLike = Like.create({
          isLiked: 1,
          user,
          blog,
          blogId
        });

        blog.likes ? blog.likes.push(newLike) : (blog.likes = [newLike]);
        await newLike.save();

        user.likedBlogs.push(blog);
        await user.save();

        blog.setlikedBy(user);
        await blog.save();
        return newLike;
      } else {
        like.isLiked = 1;
        await like.save();
        return like;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Like)
  async RemoveLike(
    @Ctx() { payload }: MyContext,
    @Arg('blogId') blogId: number
  ): Promise<Like | null> {
    const user = await User.findOneBy({ id: payload!.userId });

    if (!user) throw new AuthenticationError('认证失败');

    try {
      const blog = await Blog.findOneBy({ id: blogId });
      if (!blog) throw new Error('无法找到该文章，请重试');

      const like = await Like.findOneBy({ likedBy: user.username, blogId });

      if (!like) {
        throw new Error('您未收藏该文章');
      } else {
        like.isLiked = 0;
        await like.save();
        return like;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
