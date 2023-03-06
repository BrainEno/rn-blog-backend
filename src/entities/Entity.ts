import { PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { InterfaceType } from 'type-graphql';

@InterfaceType()
export default abstract class Entity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
