// import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
// import Blog from "../entity/Blog";
// import { isAuth } from "../middleware/isAuth";
// import { MyContext } from "../types/MyContext";

// @Resolver()
// export class BlogResolver {
//   @UseMiddleware(isAuth)
//   @Mutation(() => Blog)
//   async createBlog(
//     @Arg("title") title: string,
//     @Ctx() { payload }: MyContext,
//     @Arg("desc") desc: string,
//     @Arg("body") body: string
//   ) {}
// }
