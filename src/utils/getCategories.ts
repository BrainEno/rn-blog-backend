import Category from '../entities/Category';

export const initCategories = async () => {
  const all = new Category({
    name: '全部文章',
    identifier: 'All',
    desc: '所有用户上传的全部文章，按时间顺序排列',
    bannerUrn:
      'https://res.cloudinary.com/hapmoniym/image/upload/v1601987038/img/pic3_f65bzg.jpg'
  });
  await Category.save(all);

  const recent = new Category({
    name: '最近上传',
    identifier: 'Recent Post',
    desc: '全部用户范围内最新上传的文章，按时间顺序排列',
    bannerUrn:
      'https://res.cloudinary.com/hapmoniym/image/upload/v1635177238/img/untitled_bgwa2h.jpg'
  });
  await Category.save(recent);

  const trending = new Category({
    name: '最多收藏',
    identifier: 'Trending',
    desc: '最受喜爱的文章，按收藏数排列',
    bannerUrn:
      'https://res.cloudinary.com/hapmoniym/image/upload/v1606821628/img/trending_ykv0lv.png'
  });
  await Category.save(trending);

  const featured = new Category({
    name: '编辑精选',
    identifier: 'Featured',
    desc: '编辑精选的文章，按个人爱好挑选',
    bannerUrn:
      'https://res.cloudinary.com/hapmoniym/image/upload/v1606821627/img/featured_pw1bzg.png'
  });
  await Category.save(featured);

  return { all, recent, trending, featured };
};

export const getCategories = async (): Promise<{
  all: Category;
  recent: Category;
  trending: Category;
  featured: Category;
}> => {
  const allExists = await Category.findOneOrFail({ identifier: 'All' });
  const rencExists = await Category.findOneOrFail({
    identifier: 'Recent Post'
  });
  const trenExists = await Category.findOneOrFail({ identifier: 'Trending' });
  const featExists = await Category.findOneOrFail({ identifier: 'Featured' });
  if (!allExists && rencExists && !trenExists && !featExists) {
    return await initCategories();
  }

  return {
    all: allExists,
    recent: rencExists,
    trending: trenExists,
    featured: featExists
  };
};
