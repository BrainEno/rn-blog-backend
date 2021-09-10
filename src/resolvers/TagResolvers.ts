import { isAuth } from './../middleware/isAuth';
import { MyContext } from './../types/MyContext';
import { isEmpty } from 'class-validator';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getRepository } from 'typeorm';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import Tag from '../entities/Tag';
import User from '../entities/User';

@Resolver()
export class TagResolver {
  //新建标签
  @UseMiddleware(isAuth)
  @Mutation(() => Tag)
  async createTag(@Arg('name') name: string, @Ctx() { payload }: MyContext) {
    const user = await User.findOne({ id: payload!.userId });

    if (!user) throw new AuthenticationError('认证失败');

    try {
      const errors: any = {};
      if (isEmpty(name)) errors.name = '标签名不得为空';

      const isTag = await getRepository(Tag)
        .createQueryBuilder('tag')
        .where('lower(tag.name)=:name', { name: name.toLowerCase() })
        .getOne();

      if (isTag) errors.name = '该类名已存在';

      if (Object.keys(errors).length > 0) {
        throw errors;
      }
    } catch (err) {
      return err;
    }

    try {
      const tag = new Tag({ name });
      await tag.save();
      return tag;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //获得所有标签
  @Query(() => [Tag])
  async listAllTags() {
    try {
      const allTags = await Tag.find();
      return allTags;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //根据类名获得特定标签
  @Query(() => Tag)
  async getTagByName(@Arg('name') name: string) {
    if (isEmpty(name)) throw new UserInputError('类名不得为空');
    try {
      const tag = await Tag.findOne({ name });
      return tag;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //删除标签
  @UseMiddleware(isAuth)
  @Mutation(() => Tag)
  async deleteTag(@Ctx() { payload }: MyContext, @Arg('name') name: string) {
    const user = await User.findOneOrFail({ id: payload!.userId });
    if (!user) throw new AuthenticationError('认证失败');
    try {
      const errors: any = {};
      if (isEmpty(name)) errors.name = '请输入要删除的标签名';

      const tagToDel = await Tag.findOneOrFail(name);

      if (!tagToDel) errors.name = '您要删除的标签不存在，请重新输入';

      if (Object.keys(errors).length > 0) {
        throw errors;
      }

      try {
        const deletedTag = await tagToDel!.remove();
        return deletedTag;
      } catch (err) {
        return err;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
