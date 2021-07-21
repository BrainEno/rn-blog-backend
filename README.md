# rn-blog-backend

1.初始化 typeorm postgres 的模板：typeorm init --name server --database postgres  
2.npx tsconfig.json，选择 node 选项  
3.yarn upgrade-interactive --lastest，更新关联项，注意 pg 有时不会被更新，需要单独更新，否则会无法连接到数据库  
4.yarn add express apollo-server-express graphql type-graphql && yarn add -D @types/node @types/express @types/graphql  
7.如果数据库出错就到 postgres 删除表格再重启服务器
8.typescript compile cli 命令是：tsc --project tsconfig.json  
9.登录 postgres 数据库:psql [dbname] [username],输入密码；输入\c [dbname]进入数据库  
10.打印heroku的信息命令为：heroku logs -a [your app name]  
11.heroku运行cli命令heroku run [script] -a [your app name]  
