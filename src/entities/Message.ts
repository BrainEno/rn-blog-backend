import { Field, ObjectType } from 'type-graphql';
import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';
import { makeId } from '../utils/helpers';
import Entity from './Entity';
import User from './User';

@ObjectType()
@TOEntity('messages')
export default class Message extends Entity {
  @Field({ nullable: false })
  @Column('varchar', { nullable: false })
  identifier: string;

  @Field()
  @Column('text')
  content: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'msgTo', referencedColumnName: 'username' })
  to: User;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'msgFrom', referencedColumnName: 'username' })
  from: User;

  @Field()
  @Column()
  msgTo: string;

  @Field()
  @Column()
  msgFrom: string;

  @BeforeInsert()
  makeId() {
    this.identifier = 'm-' + makeId(5);
  }

  @CreateDateColumn()
  @Field()
  @Column()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @Column()
  updatedAt: Date;
}

export interface MessagePayload {
  identifier: string;
  msgTo: string;
  msgFrom: string;
  content: string;
  createdAt: Date;
}
