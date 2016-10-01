# Cloudeer 注册中心 socket 版本

有如下特性：

* 使用 socket 长连接连接注册中心，这是服务端，客户端将在 cloudoll 中实现。

* 加入认证

* 优化 pm2 的部署，当 pm2 为 cluster 模式时，允许注册多个一样的服务地址。这样也会增加 cluster 模式下的访问机会。

* 如果微服务注册了 notAConsumer, 那么，标记了 notAConsumer 的 socket 将不能获取服务列表。

## 客户端发起的请求


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
        "host": "127.0.0.1", 
        "port": 3009, 
        "baseUri": "",
        "notAConsumer": true
    }
}
```

## 注册中心的响应消息


登录成功后响应

```
{
    "errno": 0, 
    "cmd": "login",
    "data": {"sid" : 0}
}
```

---


错误的响应

```
{
    "errno": 403, 
    "errText": "登录失败，拒绝连接。", 
    "cmd": "login"
}
```

---

服务器向客户端通知微服务列表。

当微服务实例发生变化的时候，注册中心会依次通知

```
{
    "errno": 0, 
    "cmd": "get-services", 
    "data": {
        "cloudoll": {
            "hosts": [
                {
                    "host": "127.0.0.1", 
                    "port": 3009, 
                    "baseUri": ""
                }, 
                {
                    "host": "127.0.0.1", 
                    "port": 3009, 
                    "baseUri": ""
                }, 
                {
                    "host": "127.0.0.1", 
                    "port": 3009, 
                    "baseUri": ""
                }
            ]
        }
    }
}
```

## 注册中心询问服务器和微服务实例性能



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

    $ node add-user -u knock -p password

```

