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

  @Field()
  @Index()
  @Column("text", { unique: true })
  name: string;

  @Field()
  @Column("text", { nullable: true })
  desc?: string;

  @Field()
  @Column({ nullable: true })
  bannerUrn: string;

  @Field()
  @Column("text", { nullable: false })
  owner: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: "owner", referencedColumnName: "username" })
  user: User;

  @Field(() => [Blog])
  @OneToMany(() => Blog, (blog) => blog.id)
  blogs?: Blog[];
}
