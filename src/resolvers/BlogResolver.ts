import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import { isEmpty, ValidationError } from 'class-validator';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import Blog from '../entities/Blog';
import User from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/MyContext';
import { makeId } from '../utils/helpers';
import { getCategories } from '../utils/getCategories';
import { Brackets, getRepository } from 'typeorm';
import cloudinary from 'cloudinary';

@Resolver()
export class BlogResolver {
  //新建文章
  @UseMiddleware(isAuth)
  @Mutation(() => Blog)
  async createBlog(
    @Ctx() { payload }: MyContext,
    @Arg('title') title: string,
    @Arg('body') body: string,
    @Arg('isPublished') isPublished: boolean,
    @Arg('imageUrn') imageUrn: string
  ) {
    try {
      const user = await User.findOne({ id: payload!.userId });

      if (!user) throw new AuthenticationError('认证失败，请登录');

      if (body.trim() === '') throw new UserInputError('文章内容不得为空');
      const desc = body.trim().slice(0, 45);
      const createdAt = new Date();

      imageUrn = isEmpty(imageUrn)
        ? 'https://res.cloudinary.com/hapmoniym/image/upload/v1644331126/bot-thk/no-image_eaeuge.jpg'
        : imageUrn;

      const blog = new Blog({
        user,
        title,
        body,
        desc,
        isPublished,
        createdAt,
        imageUrn
      });

      blog.setAvatar(user);

      //默认所有文章初始分类到all
      const { all } = await getCategories();
      blog.categories = [all];

      await blog.save();
      return blog;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  //发布文章
  @UseMiddleware(isAuth)
  @Mutation(() => Blog)
  async pubBlog(
    @Ctx() { payload }: MyContext,
    @Arg('identifier') identifier: string
  ) {
    const owner = await User.findOneOrFail({ id: payload?.userId });
    if (!owner) throw new AuthenticationError('认证失败,无法编辑此文章');

    try {
      const errors: any = {};
      if (isEmpty(identifier)) errors.identifier = '请选择要发布的文章';
      const blogToPub = await Blog.findOneOrFail({ identifier });
      if (!blogToPub) throw new Error('未找到要发布的文章，请重试');
      blogToPub.isPublished = true;
      await blogToPub.save();
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //列出所有文章
  @Query(() => [Blog])
  async listAllBlogs(): Promise<Blog[]> {
    try {
      const blogs = await getRepository(Blog)
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.categories', 'category')
        .cache(true)
        .getMany();

      return blogs;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //列出相关文章
  @Query(() => [Blog])
  async relatedBlogs(
    @Arg('author') author: string,
    @Arg('identifier') identifier: string
  ): Promise<Blog[]> {
    try {
      const related = await getRepository(Blog)
        .createQueryBuilder('blog')
        .select('authorAvatar')
        .where('blog.isPublished=:isPublished', { isPublished: true })
        .andWhere(
          new Brackets((qb) => {
            qb.where('blog.author=:author', { author }).andWhere(
              'blog.identifier!=:identifier',
              { identifier }
            );
          })
        )
        .innerJoin('blog.author.avatar', 'authorAvatar')
        .orderBy('blog.createdAt', 'DESC')
        .limit(3)
        .cache(true)
        .getMany();
      return related;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //根据slug获取文章内容
  @Query(() => Blog)
  async getBlogBySlug(@Arg('slug') slug: string): Promise<Blog | null> {
    try {
      if (isEmpty(slug)) throw new ValidationError();
      const blog = await getRepository(Blog)
        .createQueryBuilder('blog')
        .where('blog.slug=:slug', { slug })
        .leftJoinAndSelect('blog.categories', 'category')
        .cache(true)
        .getOne();

      if (blog) return blog;
      return null;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  //列出自己的所有文章
  @UseMiddleware(isAuth)
  @Query(() => [Blog])
  async getOwnBlogs(@Ctx() { payload }: MyContext) {
    const owner = await User.findOneOrFail({ id: payload?.userId });
    if (!owner) throw new AuthenticationError('认证失败');
    try {
      const blogs = await Blog.find({ where: { user: owner } });
      if (!blogs) throw new Error('您还没有写过文章');
      return blogs;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //更新文章
  @UseMiddleware(isAuth)
  @Mutation(() => Blog)
  async updateBlog(
    @Ctx() { payload }: MyContext,
    @Arg('identifier') identifier: string,
    @Arg('newTitle') newTitle: string,
    @Arg('newBody') newBody: string,
    @Arg('newDesc') newDesc?: string,
    @Arg('newImage') newImage?: string
  ) {
    const owner = await User.findOneOrFail({ id: payload?.userId });
    if (!owner) throw new AuthenticationError('认证失败,无法编辑此文章');
    try {
      const errors: any = {};
      if (isEmpty(identifier)) errors.oldName = '请选择要更新的文章';
      if (isEmpty(newBody)) errors.newBody = '文章内容不得为空';
      if (isEmpty(newTitle)) errors.newTitle = '文章标题不得为空';
      if (isEmpty(newDesc)) errors.desc = '文章简介不得为空';
      if (isEmpty(newImage)) errors.image = '请上传图片或输入图片链接';
      const blogToUpd = await Blog.findOneOrFail({ identifier });

      if (!blogToUpd) errors.title = '未找到文章';

      blogToUpd!.title = newTitle;
      blogToUpd!.body = newBody;
      blogToUpd!.desc = newDesc || newBody.trim().slice(0, 45);
      if (newImage) blogToUpd!.imageUrn = newImage;
      blogToUpd.setAvatar(owner);
      await blogToUpd!.save();
      return blogToUpd;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  //删除文章
  @UseMiddleware(isAuth)
  @Mutation(() => Blog)
  async deleteBlog(@Ctx() { payload }: MyContext, @Arg('id') id: number) {
    const owner = await User.findOneOrFail({ id: payload?.userId });
    if (!owner) throw new AuthenticationError('认证失败,没有权限删除文章');

    try {
      const errors: any = {};
      if (isEmpty(id)) errors.id = '请选择要删除的文章';

      const blogToDel = await Blog.findOneOrFail(id);
      if (!blogToDel) errors.blog = '您要删除的文章不存在，请重新选择';
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

  //搜索文章
  @Query(() => [Blog])
  async searchBlog(@Arg('keyword') keyword: string) {
    try {
      const blogs = await getRepository(Blog)
        .createQueryBuilder('blog')
        .where('LOWER(blog.title) like LOWER(:keyword)', {
          keyword: `%${keyword}%`
        })
        .orWhere('LOWER(blog.desc) like LOWER(:keyword)', {
          keyword: `%${keyword}%`
        })
        .orWhere('LOWER(blog.author) like LOWER(:keyword)', {
          keyword: `%${keyword}%`
        })
        .orWhere('LOWER(blog.body) like LOWER(:keyword)', {
          keyword: `%${keyword}%`
        })
        .getMany();

      if (!blogs) throw new Error('没有找到相关文章');
      return blogs;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //删除cloudinary图片
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteCloudinaryImage(@Arg('cloudinaryUrl') cloudinaryUrl: string) {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });

    try {
      if (isEmpty(cloudinaryUrl)) throw new ValidationError();
      const blog = await Blog.findOne({ imageUrn: cloudinaryUrl });
      if (blog) {
        blog.imageUrn =
          'https://res.cloudinary.com/hapmoniym/image/upload/v1644331126/bot-thk/no-image_eaeuge.jpg';
        await blog.save();
      }

      const cloudinaryId = cloudinaryUrl.slice(
        cloudinaryUrl.lastIndexOf('/bot-thk') + 1,
        cloudinaryUrl.lastIndexOf('.')
      );
      console.log(cloudinaryId);
      const deleted = await cloudinary.v2.uploader.destroy(cloudinaryId);

      if (deleted.result === 'ok') return true;
      return false;
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  //上传博客图片
  @UseMiddleware(isAuth)
  @Mutation(() => String)
  async uploadBlogPic(
    @Ctx() { payload }: MyContext,
    @Arg('identifier') identifier: string,
    @Arg('filename') filename: string
  ) {
    const user = await User.findOne({ id: payload!.userId });

    if (!user) throw new AuthenticationError('认证失败');
    const blog = await Blog.findOneOrFail(identifier);
    if (!blog) throw new Error('未找到要上传图片的文章，请重试');
    upload.single(filename);
    blog.imageUrn = `${process.env.BASE_URL}/uploads/blogs/${filename}`;
    await blog.save();
    return blog.imageUrn;
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/blogs/',
    filename: (_, __, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname);
    }
  }),
  fileFilter: (__, file: any, callback: FileFilterCallback) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      callback(null, true);
    } else {
      callback(new Error('无效的图片类型'));
    }
  }
});
