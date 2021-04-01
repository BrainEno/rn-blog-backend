import { Field, ObjectType } from "type-graphql";
import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  ManyToMany,
} from "typeorm";
import Entity from "./Entity";
import User from "./User";
import Comment from "./Comment";
import Vote from "./Vote";
import { Expose } from "class-transformer";
import { slugify } from "../utils/helpers";
import Tag from "./Tag";

@ObjectType()
@TOEntity("blogs")
export default class Blog extends Entity {
  constructor(blog: Partial<Blog>) {
    super();
    Object.assign(this, blog);
  }

  @Field()
  @Column("uuid", { unique: true })
  identifier: string;

  @Field()
  @Index()
  @Column("text", { unique: true })
  slug: string;

  @Field()
  @Column("text", { nullable: false })
  title: string;

  @Field()
  @Column("text")
  desc: string;

  @Field()
  @Column("text", { nullable: false })
  body: string;

  @Field()
  @Column({ nullable: true })
  imageUrn: string;

  @Field()
  @Column()
  categoryName: string;

  @Field(() => [Tag])
  @ManyToMany(() => Tag, (tag) => tag.name)
  tags?: Tag[];

  @Field()
  @Column()
  author: string;

  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: "author", referencedColumnName: "username" })
  user: User;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[];

  @Field(() => [Vote])
  @OneToMany(() => Vote, (vote) => vote.blog)
  votes: Vote[];

  @Field()
  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex(
      (v): any => v.username === user.username
    );
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @Field()
  @Expose()
  get commentCount(): number {
    return this.comments?.length;
  }

  @Field()
  @Expose()
  get voteScore(): number {
    return this.votes?.reduce(
      (prev: any, curr: any) => prev + (curr.value || 0),
      0
    );
  }

  @BeforeInsert()
  makeSlug() {
    this.slug = slugify(this.title);
  }
}
