# Cloudeer 注册中心 socket 版本

有如下特性：

* 使用 socket 长连接连接注册中心，这是服务端，客户端将在 cloudoll 中实现。

* 加入注册时候的认证



## 请求消息


登录

```
{ cmd: 'login', data: { username: 'test1', password: 'test' } }
```

注册微服务

```
{ 
  cmd: 'reg-service',
  data:
   { appName: 'cloudoll',
     host: '30.97.93.78',
     port: 3009,
     baseUri: '' } 
}
```

## 响应消息

成功响应

```
{
    "errno": 0, 
    "cmd": "login"
}
```

错误的响应

```
{
    "errno": 403, 
    "errText": "登录失败，拒绝连接。", 
    "cmd": "login"
}
```

服务器返回微服务列表

```
{
    "errno": 0, 
    "cmd": "get-services", 
    "data": {
        "cloudoll": {
            "hosts": [
                {
                    "host": "30.97.93.78", 
                    "port": 3009, 
                    "baseUri": ""
                }, 
                {
                    "host": "30.97.93.78", 
                    "port": 3009, 
                    "baseUri": ""
                }, 
                {
                    "host": "30.97.93.78", 
                    "port": 3009, 
                    "baseUri": ""
                }
            ]
        }
    }
}
```

## 增加服务器用户名和密码

请使用 add-user.js

用法

```bash
node add-user -u username -p password

```

