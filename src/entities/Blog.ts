import { Field, ObjectType } from 'type-graphql';
import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  CreateDateColumn,
  AfterUpdate
} from 'typeorm';
import Entity from './Entity';
import User from './User';
import Comment from './Comment';
import Vote from './Vote';
import { Exclude, Expose } from 'class-transformer';
import { makeId, slugify } from '../utils/helpers';
import Tag from './Tag';
import Like from './Like';
import Category from './Category';

@ObjectType()
@TOEntity('blogs')
export default class Blog extends Entity {
  constructor(blog: Partial<Blog>) {
    super();
    Object.assign(this, blog);
  }

  @Field()
  @Index()
  @Column('varchar', { unique: true })
  identifier: string;

  @CreateDateColumn()
  @Field()
  @Column()
  createdAt: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  @Column({ nullable: true })
  updatedAt?: Date;

  @Field()
  @Index()
  @Column('varchar', { unique: true })
  slug: string;

  @Field()
  @Column('text', { nullable: false })
  title: string;

  @Field()
  @Column('text')
  desc: string;

  @Field()
  @Column('text', { nullable: false })
  body: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrn?: string;

  @Field(() => [Tag])
  @ManyToMany(() => Tag, (tag) => tag.blogs)
  @JoinTable({
    name: 'blog_tags',
    joinColumn: { name: 'blog_identifier', referencedColumnName: 'identifier' },
    inverseJoinColumn: { name: 'tag_name', referencedColumnName: 'name' }
  })
  tags?: Tag[];

  @Field(() => String)
  @Column('varchar', { default: '' })
  tagNames: string;

  @Field(() => [Category])
  @ManyToMany(() => Category, (category) => category.blogs, { cascade: true })
  categories?: Category[];

  @Field()
  @Column()
  author: string;

  @Field()
  @Column({
    default:
      'https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png',
    nullable: true
  })
  authorAvatar?: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => User, (user) => user.blogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'author', referencedColumnName: 'username' })
  user: User;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.blog)
  comments?: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.blog)
  votes?: Vote[];

  @Exclude()
  @OneToMany(() => Like, (like) => like.blog)
  likes?: Like[];

  @Field()
  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex(
      (v): any => v.username === user.username
    );

    this.userVote = index! > -1 ? this.votes![index!].value : 0;
  }

  @Field()
  protected userLike: number;
  setUserLike(user: User) {
    const index = this.likes?.findIndex(
      (l): any => l.username === user.username
    );
    this.userLike = index! > -1 ? this.likes![index!].isLiked : 0;
  }

  @Field({ defaultValue: 0 })
  @Expose()
  get commentCount(): number {
    if (this.comments) return this.comments!.length ? this.comments!.length : 0;
    return 0;
  }

  @Field({ defaultValue: 0 })
  @Expose()
  get voteScore(): number {
    if (!this.votes) return 0;
    return this.votes.reduce(
      (prev: any, curr: any) => prev + (curr.value || 0),
      0
    );
  }

  @Field({ defaultValue: 0 })
  @Expose()
  get likesCount(): number {
    return this.likes?.reduce(
      (prev: any, curr: any) => prev + (curr.isLiked || 0),
      0
    );
  }

  @AfterUpdate()
  setAvatar(user: User) {
    this.authorAvatar =
      user.avatar ||
      'https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png';
  }

  @AfterUpdate()
  async addTag(tag: Tag) {
    if (!this.tags) {
      this.tags = [];
    }
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      await this.save();
      this.tagNames = this.tags.map((t) => t.name).join(',');
      await this.save();
    }
  }

  @BeforeInsert()
  makeSlug() {
    this.slug = slugify(this.title);
  }

  @BeforeInsert()
  makeId() {
    this.identifier = makeId(6);
  }
}
