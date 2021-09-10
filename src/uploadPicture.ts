import multer, { FileFilterCallback } from 'multer';
import { Response, Request } from 'express';
import path from 'path';
import { makeId } from './utils/helpers';
import User from './entities/User';
import fs from 'fs';
import Blog from './entities/Blog';
import Category from './entities/Category';

const imageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];

export const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/images',
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname));
    }
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (imageTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('无效的图片类型'));
    }
  }
});

export const uploadAvatar = async (req: Request, res: Response) => {
  const user = await User.findOneOrFail({ username: req.body.username });
  if (!user) throw new Error('验证失败');
  try {
    const type = req.body.type;
    if (type !== 'avatar') {
      fs.unlinkSync(req.file!.path);
      return res.status(400).json({ error: '无效的类型' });
    }

    let oldAvatarUrn = '';
    if (type === 'avatar') {
      oldAvatarUrn = user.avatar || '';
      user.avatar = req.file!.filename;
    }
    await user.save();

    if (oldAvatarUrn !== '') {
      fs.unlinkSync(`uploads\\images\\${oldAvatarUrn}`);
    }
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: '有什么地方出错了' });
  }
};

export const uploadPicture = async (req: Request, res: Response) => {
  const user = await User.findOneOrFail({ username: req.body.username });
  if (!user) throw new Error('验证失败');
  try {
    const type = req.body.type;
    if (type !== 'image' && type !== 'banner') {
      fs.unlinkSync(req.file!.path);
      return res.status(400).json({ error: '无效的类型' });
    }

    let oldImageUrn = '';
    if (type === 'image') {
      const blog = await Blog.findOneOrFail({
        identifier: req.body.identifier
      });
      if (!blog) throw new Error('无法上传文章配图');
      oldImageUrn = blog.imageUrn || '';
      blog.imageUrn = req.file!.filename;
      await blog.save();
      if (oldImageUrn !== '') {
        fs.unlinkSync(`uploads\\images\\${oldImageUrn}`);
      }
      return res.json(blog);
    } else if (type === 'banner') {
      const cat = await Category.findOneOrFail({ name: req.body.catName });
      if (!cat) throw new Error('无法上传封面图');
      oldImageUrn = cat.bannerUrn || '';
      cat.bannerUrn = req.file!.filename;
      await cat.save();
      if (oldImageUrn !== '') {
        fs.unlinkSync(`uploads\\images\\${oldImageUrn}`);
      }
      return res.json(cat);
    }
    return true;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: '有什么地方出错了' });
  }
};
