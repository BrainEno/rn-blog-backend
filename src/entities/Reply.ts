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
  UpdateDateColumn
} from 'typeorm';
import User from './User';
import Entity from './Entity';
import { MaxLength } from 'class-validator';
import { makeId } from '../utils/helpers';
import Comment from './Comment';

@ObjectType()
@TOEntity('comments')
export default class Reply extends Entity {
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

  @CreateDateColumn()
  @Field()
  @Column()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @Column()
  updatedAt: Date;

  //将要回复的评论
  @Field(() => Comment)
  @ManyToMany(() => Comment, (comment) => comment.replies)
  comments?: Comment[];

  @BeforeInsert()
  makeId() {
    this.identifier = 'r-' + makeId(5);
  }
}
