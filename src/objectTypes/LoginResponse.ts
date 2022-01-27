import { ObjectType, Field } from 'type-graphql';
import User from '../entities/User';

@ObjectType()
export default class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  user: User;
}
