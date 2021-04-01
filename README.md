# rn-blog-backend

1.typeorm init --name server --database postgres  
2.npx tsconfig.json
3.yarn upgrade-interactive --lastest
4.yarn add express apollo-server-express graphql
5.yarn add -D @types/node @types/express @types/graphql
6.yarn add type-graphql  
7.写 UserResolvers 和 entity,然后再 index.ts 里 createConnection,如果数据库出错就到 postgres 删除表格再重启服务器,记得更新 pg,不然 typeorm 会无法连接
8.typescript compile cli 是：tsc --project tsconfig.json 9.输入\c [dbname]进入数据库
