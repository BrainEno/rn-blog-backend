import { MyContext } from '../types/MyContext';
import { isEmpty } from 'class-validator';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { Repository } from 'typeorm';
import User from '../entities/User';
import Category from '../entities/Category';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
// import { createWriteStream } from 'fs';
// import { File, UploadedFileResponse } from '../types/Upload';
// import { GraphQLUpload } from 'graphql-upload';
// import path from 'path';
import { isAdmin } from '../middleware/isAdmin';
import { AppDataSource } from '../../AppDataSource';

@Resolver()
export class CategoryResolver {
  catRepository: Repository<Category>;
  constructor() {
    this.catRepository = AppDataSource.getRepository(Category);
  }

  //创建新类别
  @UseMiddleware(isAdmin)
  @Mutation(() => Category)
  async createCategory(
    @Ctx() { payload }: MyContext,
    @Arg('name') name: string,
    @Arg('desc') desc: string,
    @Arg('bannerUrn') bannerUrn: string
  ) {
    const user = await User.findOneByOrFail({ id: payload!.userId });

    if (!user) throw new AuthenticationError('认证失败');

    try {
      const errors: any = {};
      if (isEmpty(name)) errors.name = '类名不得为空';

      const isCategory = await this.catRepository
        .createQueryBuilder('category')
        .where('lower(category.name)=:name', { name: name.toLowerCase() })
        .cache(true)
        .getOne();

      if (isCategory) errors.name = '该类名已存在';

      if (Object.keys(errors).length > 0) {
        throw errors;
      }
    } catch (err) {
      return err;
    }

    try {
      const category = new Category({ name, desc, bannerUrn });
      await category.save();
      return category;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //获得所有类别
  @Query(() => [Category])
  async listAllCategories(): Promise<Category[]> {
    try {
      const categories = this.catRepository.find({
        select: ['name', 'identifier']
      });
      return categories;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //根据类名获取类别及下属的博客
  @Query(() => Category)
  async getCatWithBlogs(
    @Arg('identifier') identifier: string
  ): Promise<Category> {
    if (isEmpty(identifier)) throw new UserInputError('类名不得为空');

    try {
      const cat = await this.catRepository
        .createQueryBuilder('category')
        .where('category.identifier=:identifier', { identifier })
        .leftJoinAndSelect('category.blogs', 'blog')
        .getOneOrFail();
      return cat;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  //根据类名获得特定类别
  @Query(() => Category)
  async getCategoryByName(@Arg('name') name: string): Promise<Category> {
    try {
      const category = await this.catRepository.findOneByOrFail({ name });
      return category;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //更新类别
  @UseMiddleware(isAdmin)
  @Mutation(() => Category)
  async updateCategory(
    @Ctx() { payload }: MyContext,
    @Arg('oldName') oldName: string,
    @Arg('newName') newName: string,
    @Arg('desc') desc: string,
    @Arg('newBanner', { nullable: false }) newBanner?: string
  ) {
    const user = await User.findOneByOrFail({ id: payload!.userId });
    if (!user) throw new AuthenticationError('认证失败');
    try {
      const errors: any = {};
      if (isEmpty(oldName)) errors.oldName = '请输入要替换的类名';
      if (isEmpty(newName)) errors.newName = '类名不得为空';
      if (isEmpty(desc)) errors.desc = '要输入的描述不得为空';

      if (Object.keys(errors).length > 0) throw errors;

      const catToUpd = await this.catRepository.findOneByOrFail({
        name: oldName
      });

      if (!catToUpd) errors.name = '您要更新的类名不存在，请直接创建';

      if (Object.keys(errors).length > 0) throw errors;

      catToUpd!.name = newName;
      catToUpd!.desc = desc;
      if (newBanner) catToUpd.bannerUrn = newBanner;

      try {
        await catToUpd!.save();
      } catch (err) {
        console.log(err);
        throw err;
      }

      return catToUpd;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //上传图片
  //   @UseMiddleware(isAdmin)
  //   @Mutation(() => String)
  //   async uploadCatBanner(
  //     @Ctx() { payload }: MyContext,
  //     @Arg('catName') cateName: string,
  //     @Arg('file', () => GraphQLUpload) { createReadStream, filename }: File
  //   ): Promise<UploadedFileResponse> {
  //     const user = await User.findOneByOrFail({ id: payload!.userId });

  //     if (!user) throw new AuthenticationError('仅管理员可进行该操作');

  //     const stream = createReadStream();

  //     await stream.pipe(
  //       createWriteStream(
  //         path.join(__dirname, `/../../../uploads/categories/${filename}`)
  //       )
  //     );

  //     const category = await this.catRepository.findOneByOrFail({
  //       name: cateName
  //     });
  //     if (!category) throw new Error('未找到要上传封面的话题，请重试');
  //     category.bannerUrn = `${process.env.BASE_URL}/uploads/categories/${filename}`;
  //     await category.save();
  //     return {
  //       url: `${process.env.BABEL_ENV}/uploads/categories/${filename}`
  //     };
  //   }
}
