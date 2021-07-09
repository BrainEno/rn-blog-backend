import { Field, ObjectType } from "type-graphql";
import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import Entity from "./Entity";
import Blog from "./Blog";
import User from "./User";

@ObjectType()
@TOEntity("categories")
export default class Category extends Entity {
  constructor(category: Partial<Category>) {
    super();
    Object.assign(this, category);
  }

  @Field({ nullable: false })
  @Index()
  @Column("text", { unique: true })
  name: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  desc?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerUrn?: string;

  @Field({ nullable: false })
  @Column("text", { name: "owner" })
  owner: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "owner", referencedColumnName: "username" })
  user: User;

  @Field(() => [Blog])
  @OneToMany(() => Blog, (blog) => blog.categories)
  blogs?: Blog[];
}
