import { Field, ObjectType } from 'type-graphql';
import { IsEmail, Length, MinLength } from 'class-validator';
import {
  Entity as TOEntity,
  Column,
  OneToMany,
  Index,
  JoinColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable
} from 'typeorm';
import Blog from './Blog';
import Entity from './Entity';
import Vote from './Vote';
import Like from './Like';
import Comment from './Comment';
import Reply from './Reply';
import Role from '../types/Roles';

@ObjectType()
@TOEntity('users')
export default class User extends Entity {
  constructor(user: Required<Pick<User, 'id'>>) {
    super();
    Object.assign(this, user);
  }

  @Field()
  @Index()
  @MinLength(1, { message: '用户名不能为空' })
  @Column('text', { unique: true })
  username: string;

  @Field()
  @Index()
  @IsEmail(undefined, { message: '请填写有效的邮箱地址' })
  @Length(1, 255, { message: '邮箱地址不能为空' })
  @Column('text', { unique: true })
  email: string;

  @Column('text')
  @MinLength(6, { message: '密码不能小于6个字符' })
  password: string;

  @Column('varchar', { nullable: false, default: Role.AUTH_USER })
  @Field(() => Role, { defaultValue: Role.AUTH_USER })
  userRole: string;

  @Column('varchar', {
    default:
      'https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png'
  })
  @Field({
    defaultValue:
      'https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png'
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
    name: 'likedBlogs',
    referencedColumnName: 'id'
  })
  likes: Like[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Field(() => [Reply])
  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply[];

  @Field({ defaultValue: 0 })
  @Column('int', { default: 0 })
  likedBlogNum: number;

  @Column('int', { default: 0 })
  tokenVersion: number;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.followers, {
    cascade: true
  })
  @JoinTable()
  followings: User[];

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.followings)
  followers: User[];

  @Column({ default: '' })
  @Field(() => String, { defaultValue: '' })
  followingIds: string;

  @Column({ default: '' })
  @Field(() => String, { defaultValue: '' })
  followerIds: string;

  @BeforeInsert()
  setLikedBlogNum() {
    if (!this.likedBlogNum) this.likedBlogNum = 0;
    this.likedBlogNum = this.likes.length;
  }

  addFollowingId(newFollowingId: string) {
    if (!this.followingIds) this.followingIds = '';
    const followingsArr =
      this.followingIds === '' ? [] : this.followingIds.split(',');

    if (!followingsArr.includes(newFollowingId))
      followingsArr.push(newFollowingId);

    this.followingIds = followingsArr.join(',');
  }

  addFollowerId(newFollowerId: string) {
    if (!this.followerIds) this.followerIds = '';
    const followersArr =
      this.followerIds === '' ? [] : this.followerIds.split(',');

    if (!followersArr.includes(newFollowerId)) followersArr.push(newFollowerId);

    this.followerIds = followersArr.join(',');
  }
}
