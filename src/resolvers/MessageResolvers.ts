import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import {
  Arg,
  Ctx,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
  UseMiddleware
} from 'type-graphql';
import { getRepository } from 'typeorm';
import Message from '../entities/Message';
import User from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/MyContext';
import { MessagePayload } from '../entities/Message';

@Resolver()
export class MessageResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Message])
  async getMessages(@Ctx() { payload }: MyContext, @Arg('from') from: string) {
    const user = await User.findOne({ id: payload?.userId });
    if (!user) throw new AuthenticationError('认证失败');
    try {
      const otherUser = await User.findOne({ username: from });
      if (!otherUser) throw new UserInputError('未找到用户');

      const usernames = [user.username, otherUser.username];

      const messages = await getRepository(Message)
        .createQueryBuilder('message')
        .where('message.msgFrom = :msgFrom', { msgFrom: usernames[0] })
        .andWhere('message.msgTo = :msgTo', { msgTo: usernames[1] })
        .orderBy('message.createdAt', 'DESC')
        .getMany();

      return messages;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Subscription(() => Message, {
    topics: 'NEW_MESSAGE',
    filter: ({ payload }: ResolverFilterData<MessagePayload>) =>
      payload.identifier !== ''
  })
  subscriptionWithFilter(
    @Root() { identifier, msgTo, msgFrom }: MessagePayload
  ) {
    const newMessage = { identifier, msgTo, msgFrom };
    return newMessage;
  }
}
