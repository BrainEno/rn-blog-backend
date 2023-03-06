# rn-blog-backend
## 注意:

1.初始化 typeorm postgres 的模板：typeorm init --name server --database postgres   
2.yarn upgrade-interactive --lastest，更新关联项时注意 pg 有时不会被更新，需要单独更新，否则无法连接到数据库      
3.如果数据库出错就到 postgres 删除表格再重启服务器
4.typescript compile cli 命令是：tsc --project tsconfig.json  
5.登录 postgres 数据库:psql [dbname] [username],输入密码；输入\c [dbname]进入数据库  
6.打印heroku的信息命令为：heroku logs --tail -a [your app name]  
7.heroku运行cli命令heroku run [script] -a [your app name]  
