import { Field, ObjectType } from 'type-graphql';
import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToMany,
  JoinTable
} from 'typeorm';
import Entity from './Entity';
import Blog from './Blog';
import { MaxLength } from 'class-validator';

@ObjectType()
@TOEntity('categories')
export default class Category extends Entity {
  constructor(category: Partial<Category>) {
    super();
    Object.assign(this, category);
  }

  @Field({ nullable: false })
  @Index()
  @Column('varchar', { unique: true })
  name: string;

  @Field({ nullable: false })
  @Index()
  @Column('varchar', { unique: true })
  identifier: string;

  @Field({ nullable: true, defaultValue: '' })
  @Column('varchar', { nullable: true, default: '' })
  @MaxLength(45, { message: '文章简介不得超过45字' })
  desc?: string;

  @Field({ nullable: true, defaultValue: '' })
  @Column({ nullable: true, default: '' })
  bannerUrn?: string;

  @Field(() => [Blog], { nullable: true })
  @ManyToMany(() => Blog, (blog) => blog.categories)
  @JoinTable()
  blogs?: Blog[];
}
