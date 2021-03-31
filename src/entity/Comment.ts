import { Field, ObjectType } from "type-graphql";
import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import User from "./User";
import Blog from "./Blog";
import Entity from "./Entity";

@ObjectType()
@TOEntity("comments")
export default class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Field()
  @Index()
  @Column("uuid", { unique: true })
  identifier: string;

  @Field()
  @Column({ nullable: false })
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Field(() => Blog)
  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;
}
