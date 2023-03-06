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
  BeforeUpdate
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

  @Field()
  @Column({ default: -1 })
  authorId: number;

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

  @Column('varchar', { default: '' })
  @Field(() => String, { defaultValue: '' })
  likedBy: string;

  setlikedBy(user: User = this.user): void {
    const likedByArr = this.likedBy ? this.likedBy.split(',') : [];
    if (!likedByArr.includes(user.username)) {
      likedByArr.push(user.username);
      this.likedBy = likedByArr.join(',');
    }
  }

  @Field({ defaultValue: 0 })
  @Expose()
  get commentCount(): number {
    return this.comments && this.comments.length ? this.comments!.length : 0;
  }

  @Field({ defaultValue: 0 })
  @Expose()
  public get voteScore(): number {
    if (!this.votes) return 0;
    return this.votes.reduce(
      (prev: any, curr: any) => prev + (curr.value || 0),
      0
    );
  }

  @Field({ defaultValue: 0 })
  @Expose()
  public get likesCount(): number {
    if (this.likes) return this.likes.length;
    return 0;
  }

  async getComments(blogIdentifier: string) {
    const comments = await Comment.findBy({ blog_identifier: blogIdentifier });
    this.comments = comments;
    await this.save();
    return comments;
  }

  setAvatar(user: User) {
    user && user.avatar
      ? (this.authorAvatar = user.avatar)
      : (this.authorAvatar =
          'https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png');
  }

  setAuthorId(user: User) {
    user && user.id ? (this.authorId = user.id) : (this.authorId = -1);
  }

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

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
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
