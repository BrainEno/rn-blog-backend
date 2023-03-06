import Category from '../entities/Category';
import { AppDataSource } from '../../AppDataSource';

const categoryRepository = AppDataSource.getRepository(Category);

const createCategory = async ({
  name,
  identifier,
  desc,
  bannerUrn
}: {
  name: string;
  identifier: string;
  desc: string;
  bannerUrn: string;
}) => {
  const cat = categoryRepository.create({ name, identifier, desc, bannerUrn });
  await categoryRepository.save(cat);
};

export const getCategories = async (): Promise<{
  all: Category;
  recent: Category;
  trending: Category;
  featured: Category;
}> => {
  const allExists = await categoryRepository.findOneByOrFail({
    identifier: 'all'
  });
  const rencExists = await categoryRepository.findOneByOrFail({
    identifier: 'recent'
  });
  const trenExists = await categoryRepository.findOneByOrFail({
    identifier: 'trending'
  });
  const featExists = await categoryRepository.findOneByOrFail({
    identifier: 'featured'
  });

  if (!allExists) {
    await createCategory({
      name: '全部文章',
      identifier: 'all',
      desc: '所有用户上传的全部文章，按时间顺序排列',
      bannerUrn:
        'https://res.cloudinary.com/hapmoniym/image/upload/v1601987038/img/pic3_f65bzg.jpg'
    });
  } else if (!rencExists) {
    await createCategory({
      name: '最近上传',
      identifier: 'recent',
      desc: '全部用户范围内最新上传的文章，按时间顺序排列',
      bannerUrn:
        'https://res.cloudinary.com/hapmoniym/image/upload/v1635177238/img/untitled_bgwa2h.jpg'
    });
  } else if (!trenExists) {
    await createCategory({
      name: '最多收藏',
      identifier: 'trending',
      desc: '最受喜爱的文章，按收藏数排列',
      bannerUrn:
        'https://res.cloudinary.com/hapmoniym/image/upload/v1606821628/img/trending_ykv0lv.png'
    });
  } else if (!featExists) {
    await createCategory({
      name: '编辑精选',
      identifier: 'featured',
      desc: '编辑精选的文章，按个人爱好挑选',
      bannerUrn:
        'https://res.cloudinary.com/hapmoniym/image/upload/v1606821627/img/featured_pw1bzg.png'
    });
  }

  return {
    all: allExists,
    recent: rencExists,
    trending: trenExists,
    featured: featExists
  };
};
