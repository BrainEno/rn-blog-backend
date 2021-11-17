import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Category from '../entities/Category';

export default class CreateCats implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values([
        {
          name: '全部文章',
          identifier: 'All',
          desc: '所有用户上传的全部文章，按时间顺序排列',
          bannerUrn:
            'https://res.cloudinary.com/hapmoniym/image/upload/v1601987038/img/pic3_f65bzg.jpg'
        },
        {
          name: '最近上传',
          identifier: 'Rencent Post',
          desc: '全部用户范围内最新上传的文章，按时间顺序排列',
          bannerUrn:
            'https://res.cloudinary.com/hapmoniym/image/upload/v1635177238/img/untitled_bgwa2h.jpg'
        },
        {
          name: '最多收藏',
          identifier: 'Trending',
          desc: '最受喜爱的文章，按收藏数排列',
          bannerUrn:
            'https://res.cloudinary.com/hapmoniym/image/upload/v1606821628/img/trending_ykv0lv.png'
        },
        {
          name: '编辑精选',
          identifier: 'Featured',
          desc: '编辑精选的文章，按个人爱好挑选',
          bannerUrn:
            'https://res.cloudinary.com/hapmoniym/image/upload/v1606821627/img/featured_pw1bzg.png'
        }
      ])
      .execute();
  }
}
