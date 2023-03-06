import { Field, ObjectType } from 'type-graphql';
import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate
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

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column({ nullable: true })
  @Field({ nullable: true })
  blog_identifier: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  reply_identifiers: string;

  //评论收到的回复
  @Field(() => Reply)
  @ManyToMany(() => Reply, (reply) => reply.comments)
  @JoinColumn({ name: 'reply_identifiers', referencedColumnName: 'identifier' })
  replies?: Reply[];

  @Field(() => Blog)
  @ManyToOne(() => Blog, (blog) => blog.comments)
  @JoinColumn({ name: 'blog_identifier', referencedColumnName: 'identifier' })
  blog: Blog;

  @BeforeInsert()
  makeId() {
    this.identifier = 'c-' + makeId(5);
  }

  @BeforeInsert()
  createDate() {
    this.createdAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateDate() {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  splitReplies() {
    if (this.replies) {
      const replies = this.replies.map((reply) => reply.identifier);
      this.reply_identifiers = replies.length > 0 ? replies.join(',') : '';
    }
  }
}
