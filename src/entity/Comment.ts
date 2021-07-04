import { Field, ObjectType } from "type-graphql";
import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import User from "./User";
import Blog from "./Blog";
import Entity from "./Entity";
import { MaxLength } from "class-validator";

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
  @MaxLength(150)
  @Column("text", { nullable: false })
  content: string;

  @Field()
  @Column({ nullable: false })
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  //要回复的评论
  @ManyToMany(() => Comment)
  @JoinColumn({ name: "toReply", referencedColumnName: "identifier" })
  reply?: Comment[];

  @Field()
  @Column("uuid", { nullable: true })
  toReply?: string;

  @Field(() => Blog)
  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;
}
