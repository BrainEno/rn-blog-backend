import { Field, ObjectType } from "type-graphql";
import { IsEmail, Length, MinLength } from "class-validator";
import {
  Entity as TOEntity,
  Column,
  OneToMany,
  Index,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import Blog from "./Blog";
import Entity from "./Entity";
import Vote from "./Vote";
import Like from "./Like";
import Comment from "./Comment";
import Reply from "./Reply";
import Roles from "../types/Roles";

@ObjectType()
@TOEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Field()
  @Index()
  @MinLength(1, { message: "用户名不能为空" })
  @Column("text", { unique: true })
  username: string;

  @Field()
  @Index()
  @IsEmail(undefined, { message: "请填写有效的邮箱地址" })
  @Length(1, 255, { message: "邮箱地址不能为空" })
  @Column("text", { unique: true })
  email: string;

  @Column("text")
  @MinLength(6, { message: "密码不能小于6个字符" })
  password: string;

  @Column("varchar", { nullable: false, default: Roles.NORMAL_USER })
  @Field(() => [Roles])
  roles: string;

  @Column("varchar", {
    default:
      "https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png",
  })
  @Field({
    defaultValue:
      "https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png",
  })
  avatar: string;

  @Field(() => [Blog])
  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @Field(() => [Vote])
  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.user)
  @JoinColumn({
    name: "likedBlogs",
    referencedColumnName: "id",
  })
  likes: Like[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Field(() => [Reply])
  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply[];

  @Field()
  @Column({ nullable: true })
  likedBlogNum?: number;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @BeforeInsert()
  getLikedBlogNum() {
    this.likedBlogNum = this.likes.length;
  }
}
