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
import { Exclude, Expose } from "class-transformer";
import { slugify } from "../utils/helpers";
import Tag from "./Tag";
import Like from "./Like";

@ObjectType()
@TOEntity("blogs")
export default class Blog extends Entity {
  constructor(blog: Partial<Blog>) {
    super();
    Object.assign(this, blog);
  }

  @Field()
  @Index()
  @Column("uuid", { unique: true })
  identifier: string;

  @Field()
  @Index()
  @Column("varchar", { unique: true })
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
  @Column("text")
  categoryName: string;

  @Field(() => [Tag])
  @ManyToMany(() => Tag, (tag) => tag.name)
  tags?: Tag[];

  @Field()
  @Column()
  author: string;

  @Field()
  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: "author", referencedColumnName: "username" })
  user: User;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.blog)
  votes: Vote[];

  @Exclude()
  @OneToMany(() => Like, (like) => like.blog)
  likes: Like[];

  @Field()
  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex(
      (v): any => v.username === user.username
    );
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @Field()
  protected userLike: number;
  setUserLike(user: User) {
    const index = this.likes?.findIndex(
      (l): any => l.username === user.username
    );
    this.userLike = index > -1 ? this.likes[index].isLiked : 0;
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

  //返回收藏数
  @Field()
  @Expose()
  get likesCount(): number {
    return this.likes?.reduce(
      (prev: any, curr: any) => prev + (curr.isLiked || 0),
      0
    );
  }

  @BeforeInsert()
  makeSlug() {
    this.slug = slugify(this.title);
  }
}
