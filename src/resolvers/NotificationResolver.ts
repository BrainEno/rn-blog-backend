import { PubSubEngine } from 'graphql-subscriptions';
import {
  Arg,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription
} from 'type-graphql';
import { Notification, NotificationPayload } from '../entities/Notification';

@Resolver()
export class NotificationResolver {
  @Query(() => Date)
  currentDate() {
    return new Date();
  }

  @Mutation(() => Boolean)
  async pubSubMutation(
    @PubSub() pubSub: PubSubEngine,
    @Arg('id') id: number,
    @Arg('message', { nullable: true }) message?: string
  ): Promise<boolean> {
    const payload: NotificationPayload = { id, message };
    await pubSub.publish('NOTIFICATIONS', payload);
    return true;
  }

  @Mutation(() => Boolean)
  async publishMutation(
    @PubSub('NOTIFICATION') publish: Publisher<NotificationPayload>,
    @Arg('id') id: number,
    @Arg('message', { nullable: true }) message?: string
  ): Promise<boolean> {
    await publish({ id, message });
    return true;
  }

  @Subscription(() => Notification, {
    topics: 'NOTIFICATIONS',
    filter: ({ payload }: ResolverFilterData<NotificationPayload>) =>
      payload.id % 1 === 0
  })
  subscriptionWithFilter(@Root() { id, message }: NotificationPayload) {
    const newNotification: Notification = { id, message, date: new Date() };
    return newNotification;
  }

  //dynamic topic
  @Mutation(() => Boolean)
  async pubsubMutationToDynamicTopic(
    @PubSub() pubSub: PubSubEngine,
    @Arg('topic') topic: string,
    @Arg('id') id: number,
    @Arg('message', { nullable: true }) message?: string
  ): Promise<boolean> {
    const payload: NotificationPayload = { id, message };
    await pubSub.publish(topic, payload);
    return true;
  }

  @Subscription({
    topics: ({ args }) => args.topic
  })
  subscriptionWithFilterToDynamicTopic(
    @Arg('topic') topic: string,
    @Root() { id, message }: NotificationPayload
  ): Notification {
    console.log(topic);
    return { id, message, date: new Date() };
  }
}
