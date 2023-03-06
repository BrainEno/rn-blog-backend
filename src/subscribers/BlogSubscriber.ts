import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import Blog from "../entities/Blog";

@EventSubscriber()
export class BlogSubscriber implements EntitySubscriberInterface<Blog> {
  listenTo() {
    return Blog;
  }

  beforeInsert(event:InsertEvent<Blog>) {
    console.log("before insert blog",event.entity);
  }

  afterUpdate(event: UpdateEvent<Blog>) {
    console.log("after update blog",event.entity);
  }

 
}