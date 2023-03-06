import { Field, ObjectType } from 'type-graphql';
import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  ManyToMany
} from 'typeorm';
import { slugify } from '../utils/helpers';
import Blog from './Blog';
import Entity from './Entity';

@ObjectType()
@TOEntity('tags')
export default class Tag extends Entity {
  @Field()
  @Column({ unique: true, nullable: false })
  name: string;

  @Field(() => [Blog])
  @ManyToMany(() => Blog, (blog) => blog.id)
  blogs?: Blog[];

  @Field()
  @Index()
  @Column('varchar', { unique: true, nullable: false })
  slug: string;

  @BeforeInsert()
  makeSlug() {
    this.slug = slugify(this.name);
  }
}
