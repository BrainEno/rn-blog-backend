import { Field, ObjectType } from "type-graphql";
import {
  Entity as TOEntity,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Entity from "./Entity";
import { Blog } from "./Blog";
import { User } from "./User";

@ObjectType()
@TOEntity("likes")
export default class Like extends Entity {
  constructor(like: Partial<Like>) {
    super();
    Object.assign(this, like);
  }

  @Field()
  @Column()
  count: number;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Field()
  @Column()
  username: string;

  @Field(() => Blog)
  @OneToOne(() => Blog)
  blog: Blog;
}
