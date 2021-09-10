import { Field, ObjectType } from 'type-graphql';
import { Entity as TOEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Comment from './Comment';
import Entity from './Entity';
import Blog from './Blog';
import User from './User';

@ObjectType()
@TOEntity('votes')
export default class Vote extends Entity {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Field()
  @Column('int')
  value: number;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Field()
  @Column('varchar')
  username: string;

  @Field(() => Blog)
  @ManyToOne(() => Blog)
  blog: Blog;

  @ManyToOne(() => Comment)
  comment: Comment;
}
