import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert
} from 'typeorm';
import Entity from './Entity';
import Blog from './Blog';
import User from './User';

@ObjectType()
@TOEntity('likes')
export default class Like extends Entity {
  //已收藏：1，未收藏：0
  @Field(() => Int)
  @Column('int', { default: 0 })
  isLiked: number;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'likedBy', referencedColumnName: 'username' })
  user: User;

  @Field()
  @Column()
  likedBy: string;

  @Field(() => Int)
  @Column('int')
  blogId: number;

  @Field(() => Blog)
  @ManyToOne(() => Blog)
  @JoinColumn({ name: 'blogId', referencedColumnName: 'id' })
  blog: Blog;

  @CreateDateColumn()
  @Field()
  @Column()
  createdAt: Date;

  @BeforeInsert()
  createDate() {
    this.createdAt = new Date();
  }
}
