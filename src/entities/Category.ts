import { Field, ObjectType } from 'type-graphql';
import { Entity as TOEntity, Column, Index, OneToMany } from 'typeorm';
import Entity from './Entity';
import Blog from './Blog';

@ObjectType()
@TOEntity('categories')
export default class Category extends Entity {
  constructor(category: Partial<Category>) {
    super();
    Object.assign(this, category);
  }

  @Field({ nullable: false })
  @Index()
  @Column('text', { unique: true })
  name: string;

  @Field({ nullable: true, defaultValue: '' })
  @Column('text', { nullable: true, default: '' })
  desc?: string;

  @Field({ nullable: true, defaultValue: '' })
  @Column({ nullable: true, default: '' })
  bannerUrn?: string;

  @Field(() => [Blog])
  @OneToMany(() => Blog, (blog) => blog.categories)
  blogs?: Blog[];
}
