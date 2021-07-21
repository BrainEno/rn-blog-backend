import { AuthenticationError } from "apollo-server-express";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import Blog from "../entity/Blog";
import Like from "../entity/Like";
import User from "../entity/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types/MyContext";

@Resolver()
export class LikeResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Like)
  async ToggleLike(
    @Ctx() { payload }: MyContext,
    @Arg("isLiked") isLiked: number,
    @Arg("blogId") blogId: number
  ) {
    const user = await User.findOne({ id: payload!.userId });

    if (!user) throw new AuthenticationError("认证失败");

    try {
      let newLike;
      const like = await Like.findOne({ username: user.username });
      //if areadly be liked,cancel the like
      if (like && like.isLiked !== 0) like.isLiked = 0;
      if (!like) {
        let blog = await Blog.findOneOrFail({ id: blogId });
        if (!blog) throw new Error("无法收藏该文章，请重试");
        newLike = new Like({
          isLiked,
          user,
          blog,
        });
        await newLike.save();
        return newLike;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
