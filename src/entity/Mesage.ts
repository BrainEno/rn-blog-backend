import { Field, ObjectType } from "type-graphql";
import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { makeId } from "../utils/helpers";
import Entity from "./Entity";
import User from "./User";

@ObjectType()
@TOEntity("messages")
export default class Message extends Entity {
  constructor(message: Partial<Message>) {
    super();
    Object.assign(this, message);
  }

  @Field()
  @Column("varchar")
  identifier: string;

  @Field()
  @Column("text")
  content: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: "msgTo", referencedColumnName: "username" })
  to: User;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: "msgFrom", referencedColumnName: "username" })
  from: User;

  @Field()
  @Column()
  msgTo: string;

  @Field()
  @Column()
  msgFrom: string;

  @BeforeInsert()
  makeId() {
    this.identifier = "m-" + makeId(5);
  }
}
