import { Exclude } from "class-transformer";
import { Field, ObjectType } from "type-graphql";
import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { slugify } from "../utils/helpers";
import Blog from "./Blog";

@ObjectType()
@TOEntity("tags")
export default class Tag {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

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
