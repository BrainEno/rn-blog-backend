import { isAuth } from "./../middleware/isAuth";
import { MyContext } from "./../types/MyContext";
import { isEmpty } from "class-validator";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getRepository } from "typeorm";
import User from "../entity/User";
import Category from "../entity/Category";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { createWriteStream } from "fs";
import { File, UploadedFileResponse } from "../types/Upload";
import { GraphQLUpload } from "graphql-upload";
// import multer, { FileFilterCallback } from "multer";
// import { makeId } from "../utils/helpers";
// import path from "path";

@Resolver()
export class CategoryResolver {
  //创建新类别
  @UseMiddleware(isAuth)
  @Mutation(() => Category)
  async createCategory(
    @Arg("name") name: string,
    @Ctx() { payload }: MyContext,
    @Arg("desc") desc: string
  ) {
    const user = await User.findOne({ id: payload!.userId });

    if (!user) throw new AuthenticationError("认证失败");

    try {
      let errors: any = {};
      if (isEmpty(name)) errors.name = "类名不得为空";

      const isCategory = await getRepository(Category)
        .createQueryBuilder("category")
        .where("lower(category.name)=:name", { name: name.toLowerCase() })
        .getOne();

      if (isCategory) errors.name = "该类名已存在";

      if (Object.keys(errors).length > 0) {
        throw errors;
      }
    } catch (err) {
      return err;
    }

    try {
      const category = new Category({ user, name, desc });
      await category.save();
      return category;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //获得所有类别
  @Query(() => [Category])
  async listAllCategories() {
    try {
      const categories = await Category.find();
      return categories;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //根据类名获得特定类别
  @Query(() => Category)
  async getCategoryByName(@Arg("name") name: string) {
    if (isEmpty(name)) throw new UserInputError("类名不得为空");
    try {
      const category = await Category.findOne({ name });
      return category;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //根据创建人获取类别
  @UseMiddleware(isAuth)
  @Query(() => [Category])
  async getOWnCategories(@Ctx() { payload }: MyContext) {
    const owner = await User.findOneOrFail({ id: payload!.userId });
    if (!owner) throw new AuthenticationError("认证失败");
    try {
      const categories = await Category.find({ where: { owner } });
      if (categories) return categories;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //更新类别
  @UseMiddleware(isAuth)
  @Mutation(() => Category)
  async updateCategory(
    @Ctx() { payload }: MyContext,
    @Arg("oldName") oldName: string,
    @Arg("newName") newName: string,
    @Arg("desc") desc: string
  ) {
    const user = await User.findOneOrFail({ id: payload!.userId });
    if (!user) throw new AuthenticationError("认证失败");
    try {
      let errors: any = {};
      if (isEmpty(oldName)) errors.oldName = "请输入要替换的类名";
      if (isEmpty(newName)) errors.newName = "类名不得为空";
      if (isEmpty(desc)) errors.desc = "要输入的描述不得为空";

      if (Object.keys(errors).length > 0) throw errors;

      // let catToUpd = await getRepository(Category)
      //   .createQueryBuilder("category")
      //   .where("lower(category.name)=:oldName", {
      //     oldName: oldName.toLowerCase(),
      //   })
      //   .getOne();

      let catToUpd = await Category.findOneOrFail({ name: oldName });

      if (!catToUpd) errors.name = "您要更新的类名不存在，请直接创建";

      if (Object.keys(errors).length > 0) throw errors;

      catToUpd!.name = newName;
      catToUpd!.desc = desc;

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
  @UseMiddleware(isAuth)
  @Mutation(() => String)
  async uploadCatBanner(
    @Ctx() { payload }: MyContext,
    @Arg("catName") cateName: string,
    @Arg("file", () => GraphQLUpload) { createReadStream, filename }: File
  ): Promise<UploadedFileResponse> {
    const user = await User.findOne({ id: payload!.userId });

    if (!user) throw new AuthenticationError("认证失败");

    const stream = createReadStream();

    stream.pipe(
      createWriteStream(__dirname, `/../../../uploads/categories/${filename}`)
    );

    let category = await Category.findOneOrFail({ name: cateName });
    if (!category) throw new Error("未找到要上传封面的话题，请重试");
    category.bannerUrn = `${process.env.BASE_URL}/uploads/categories/${filename}`;
    await category.save();
    return {
      url: `${process.env.BABEL_ENV}/uploads/categories/${filename}`,
    };
  }
}
