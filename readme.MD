# Cloudeer 注册中心 socket 版本

有如下特性：

* 使用 socket 长连接连接注册中心，这是服务端，客户端将在 cloudoll 中实现。

* 加入认证

* 优化 pm2 的部署，当 pm2 为 cluster 模式时，允许注册多个一样的服务地址。

* 如果微服务注册了 notAConsumer, 那么，标记了 notAConsumer 的 socket 将不能获取服务列表。

## 请求消息


登录

```
{
    "cmd": "login", 
    "data": {
        "username": "test1", 
        "password": "test"
    }
}
```

注册微服务

```
{
    "cmd": "reg-service", 
    "data": {
        "appName": "cloudoll", 
        "host": "30.97.93.78", 
        "port": 3009, 
        "baseUri": "",
        "notAConsumer": true
    }
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
  Usage: add-user [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -u, --username           用户名（必填）
    -p, --password           密码（必填）

  Examples:

    $ node add-user -u username -p password



```

