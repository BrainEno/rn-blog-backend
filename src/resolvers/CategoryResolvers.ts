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
      return categories;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //上传图片
  @UseMiddleware(isAuth)
  @Mutation(() => String)
  async singleFileUpload(
    @Ctx() { payload }: MyContext,
    @Arg("file", () => GraphQLUpload) { createReadStream, filename }: File
  ): Promise<UploadedFileResponse> {
    const user = await User.findOne({ id: payload!.userId });

    if (!user) throw new AuthenticationError("认证失败");

    const stream = createReadStream();
    stream.pipe(createWriteStream(__dirname, `/../../../images/${filename}`));

    return {
      url: `http://localhost:4000/images/${filename}`,
    };
  }
}
