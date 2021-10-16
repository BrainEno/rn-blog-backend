import { Exclude } from 'class-transformer';
import { Field, ID, ObjectType } from 'type-graphql';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class Notification {
  @Exclude()
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  message?: string;

  @CreateDateColumn()
  @Field()
  date: Date;
}

export interface NotificationPayload {
  id: number;
  message?: string;
}
