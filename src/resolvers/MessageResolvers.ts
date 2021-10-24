import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
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
import { Topic } from '../topics';

@Resolver()
export class MessageResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Message])
  async getMessages(@Ctx() { payload }: MyContext, @Arg('from') from: string) {
    try {
      //验证当前用户
      const currUser = await User.findOne({
        where: { id: payload?.userId },
        select: ['username']
      });
      if (!currUser) throw new AuthenticationError('认证失败');

      //查找发信用户
      const otherUser = await User.findOne({
        where: { username: from },
        select: ['username']
      });
      if (!otherUser) throw new UserInputError('未找到用户');

      const usernames = [currUser, otherUser.username];

      const messages = await getRepository(Message)
        .createQueryBuilder('message')
        .where('message.msgFrom = :msgFrom', { msgFrom: usernames[0] })
        .andWhere('message.msgTo = :msgTo', { msgTo: usernames[1] })
        .orderBy('message.createdAt', 'ASC')
        .getMany();

      return messages;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Message)
  async sendMessage(
    @Ctx() { payload }: MyContext,
    @PubSub(Topic.NewMessage) publish: Publisher<MessagePayload>,
    @Arg('to') to: string,
    @Arg('content') content: string
  ) {
    try {
      const currUser = await User.findOne({
        where: { id: payload?.userId },
        select: ['username']
      });
      console.log(currUser);
      if (!currUser) throw new AuthenticationError('认证失败');

      const recipient = await User.findOne({
        where: { username: to },
        select: ['username']
      });
      if (!recipient) {
        throw new UserInputError('未找到该用户');
      } else if (recipient.username === currUser.username) {
        throw new UserInputError('抱歉，不能给自己发消息');
      }

      if (content.trim() === '') {
        throw new UserInputError('信息内容不得为空');
      }

      const message = new Message({
        msgFrom: currUser.username,
        msgTo: to,
        content
      });

      await message.save();

      await publish({
        identifier: message.identifier,
        content: message.content,
        msgFrom: message.msgFrom,
        msgTo: message.msgTo,
        createdAt: message.createdAt
      });

      return message;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Subscription(() => Message, {
    topics: Topic.NewMessage,
    filter: ({ payload }: ResolverFilterData<MessagePayload>) =>
      payload.content.trim() !== ''
  })
  getMessage(
    @Root() { identifier, content, msgTo, msgFrom, createdAt }: MessagePayload
  ) {
    const newMessage: MessagePayload = {
      identifier,
      content,
      msgTo,
      msgFrom,
      createdAt
    };
    return newMessage;
  }
}
