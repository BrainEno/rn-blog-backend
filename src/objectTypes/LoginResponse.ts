import { ObjectType, Field } from 'type-graphql';


@ObjectType()
export class UserInfo{
  @Field(() => String)
  username: string;

  @Field(() => String)
  userRole: string;

  @Field(() => String)
  avatar: string;
}

@ObjectType()
export default class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  user: UserInfo;
}
