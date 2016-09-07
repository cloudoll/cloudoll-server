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
{ errno: 0, cmd: 'login' }
```

服务器端主动拒绝

```
{ errno: 403, errText: '登录失败，拒绝连接。' }
```

