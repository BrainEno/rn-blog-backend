import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity as TOEntity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import Entity from "./Entity";
import { Blog } from "./Blog";
import { User } from "./User";

@ObjectType()
@TOEntity("categories")
export class Category extends Entity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  identifier: string;

  @Field()
  @Index()
  @Column("text", { unique: true })
  name: string;

  @Field()
  @Column("text", { nullable: false })
  title: string;

  @Field()
  @Column("text", { nullable: true })
  desc: string;

  @Field()
  @Column("bytea", { nullable: true })
  banner?: Buffer;

  @Field()
  @Column("bytea", { nullable: true })
  image?: Buffer;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Field(() => [Blog])
  @OneToMany(() => Blog, (blog) => blog.id)
  blogs: Blog[];
}
