1.typeorm init --name server --database postgres  
2.npx tsconfig.json
3.yarn upgrade-interactive --lastest
4.yarn add express apollo-server-express graphql
5.yarn add -D @types/node @types/express @types/graphql
6.yarn add type-graphql  
7.写 UserResolvers 和 entity,然后再 index.ts 里 createConnection,如果数据库出错就到 postgres 删除表格再重启服务器
