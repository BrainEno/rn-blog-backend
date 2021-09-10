import { Field, ObjectType } from 'type-graphql';
import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  BeforeInsert
} from 'typeorm';
import User from './User';
import Blog from './Blog';
import Entity from './Entity';
import { MaxLength } from 'class-validator';
import { makeId } from '../utils/helpers';
import Reply from './Reply';

@ObjectType()
@TOEntity('comments')
export default class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Field()
  @Index()
  @Column('varchar', { unique: true })
  identifier: string;

  @Field()
  @MaxLength(150)
  @Column('text', { nullable: false })
  content: string;

  @Field()
  @Column({ nullable: false })
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  //评论收到的回复
  @Field(() => Reply)
  @ManyToMany(() => Reply, (reply) => reply.comments)
  replies?: Reply[];

  @Field(() => Blog)
  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;

  @BeforeInsert()
  makeId() {
    this.identifier = 'c-' + makeId(5);
  }
}
