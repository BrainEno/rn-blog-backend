import { Field, ObjectType } from "type-graphql";
import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  ManyToMany,
} from "typeorm";
import { slugify } from "../utils/helpers";
import Blog from "./Blog";
import Entity from "./Entity";

@ObjectType()
@TOEntity("tags")
export default class Tag extends Entity {
  constructor(tag: Partial<Tag>) {
    super();
    Object.assign(this, tag);
  }

  @Field()
  @Column()
  name: string;

  @Field(() => [Blog])
  @ManyToMany(() => Blog, (blog) => blog.id)
  blogs?: Blog[];

  @Field()
  @Index()
  @Column("text", { unique: true })
  slug: string;

  @BeforeInsert()
  makeSlug() {
    this.slug = slugify(this.name);
  }
}
