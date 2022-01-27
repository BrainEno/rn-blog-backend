import { Field, ObjectType } from 'type-graphql';
import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import Entity from './Entity';
import Blog from './Blog';
import User from './User';

@ObjectType()
@TOEntity('likes')
export default class Like extends Entity {
  constructor(like: Partial<Like>) {
    super();
    Object.assign(this, like);
  }

  //已收藏：1，未收藏：0
  @Field()
  @Column('int', { default: 0 })
  isLiked: number;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Field()
  @Column()
  username: string;

  @Field(() => Blog)
  @ManyToOne(() => Blog)
  blog: Blog;

  @CreateDateColumn()
  @Field()
  @Column()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @Column()
  updatedAt: Date;
}
