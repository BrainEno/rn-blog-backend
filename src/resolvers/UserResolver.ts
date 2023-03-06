import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware
} from 'type-graphql';
import User from '../entities/User';
import { MyContext } from '../types/MyContext';
import { isAuth } from '../middleware/isAuth';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import { isEmpty, isNotEmpty } from 'class-validator';
import cloudinary from 'cloudinary';
import { AppDataSource } from '../../AppDataSource';
import { Repository } from 'typeorm';

@Resolver()
export class UserResolver {
  userRepository: Repository<User>;
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  //关注用户
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async follow(
    @Ctx() { payload }: MyContext,
    @Arg('username') username: string
  ) {
    if (isEmpty(username)) throw new Error('该用户不存在');
    try {
      const curUser = await this.userRepository.findOneByOrFail({
        id: payload.userId
      });
      if (!curUser) throw new AuthenticationError('登录过期,请重新登录');

      const toFollow = await this.userRepository.findOneByOrFail({ username });
      if (!toFollow) throw new Error('该用户不存在或已注销');
      if (payload.userId === toFollow.id)
        throw new AuthenticationError('不能关注自己');

      if (!curUser.followings) curUser.followings = [];
      if (!toFollow.followers) toFollow.followers = [];

      curUser.followings.push(toFollow);
      toFollow.followers.push(curUser);

      curUser.addFollowingId(toFollow.id.toString());
      toFollow.addFollowerId(curUser.id.toString());

      await this.userRepository.save(curUser);
      await this.userRepository.save(toFollow);
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

  //更改头像
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async changeAvatar(
    @Ctx() { payload }: MyContext,
    @Arg('avatarUrl') avatarUrl: string
  ) {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });

    try {
      if (isEmpty(avatarUrl))
        throw new UserInputError('头像链接无效，请重新上传');
      const user = await User.findOne({
        where: { id: payload.userId }
      });

      if (user) {
        const prevUrl = user.avatar;
        const cloudinaryId =
          prevUrl.lastIndexOf('/bot-thk') !== -1 &&
          prevUrl.lastIndexOf('.') !== -1
            ? prevUrl.slice(
                prevUrl.lastIndexOf('/bot-thk') + 1,
                prevUrl.lastIndexOf('.')
              )
            : '';

        user.avatar = avatarUrl;
        await user.save();

        if (isNotEmpty(cloudinaryId)) {
          await cloudinary.v2.uploader.destroy(cloudinaryId);
        }

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('ERROR: ', error);
      return false;
    }
  }
}
