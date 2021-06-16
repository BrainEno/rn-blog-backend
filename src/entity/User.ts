import { Field, ObjectType } from "type-graphql";
import { IsEmail, Length, MinLength } from "class-validator";
import {
  Entity as TOEntity,
  Column,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import Blog from "./Blog";
import Entity from "./Entity";
import Vote from "./Vote";
import Like from "./Like";
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

  @Field(() => [Blog])
  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @Field(() => [Vote])
  @OneToMany(() => Vote, (vote) => vote.user)
  vote: Vote[];

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.blog)
  @JoinColumn({ name: "likedBlogs", referencedColumnName: "blog" })
  like: Like;

  @Column("int", { default: 0 })
  tokenVersion: number;
}
