import { PrimaryGeneratedColumn, BaseEntity, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Field } from 'type-graphql';

export default abstract class Entity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @CreateDateColumn()
  @Field()
  updatedAt?: Date;
}
