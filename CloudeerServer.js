const net = require('net');

function CloudeerServer(options) {
  options      = options || {};
  this.port    = options.port;
  this.clients = [];
  this.server  = null;
}

CloudeerServer.prototype.startService = function () {

  console.log("正在启动 Cloudeer 注册服务...");

  this.server = net.createServer((socket)=> {
    var _this = this;
    console.log('有客户端请求连接进入，等待身份认证...');

    socket.on('data', (data)=> {
      var jsonInfo;
      try {
        jsonInfo = JSON.parse(data.toString());
      } catch (e) {
        console.error("错误的数据，必须提供 json 格式的数据。");
        console.log(data.toString());
      }

      console.log(jsonInfo);

      if (!jsonInfo.cmd) {
        console.error("错误的消息体，缺少 cmd 参数。");
      } else {
        switch (jsonInfo.cmd){
          case "login":
            _this.login(socket, jsonInfo.data.username, jsonInfo.data.password);
            break;
          case "reg-service":
            break;
        }

        _this.arrangeServers();

      }

      // socket.tag = JSON.parse(data.toString());
      // _this.clients.push(socket);

    });


    socket.on('end', ()=> {
      console.log(socket.serviceName || "未命名", '微服务已经退出');
      _this.clients.splice(_this.clients.indexOf(socket), 1);
    });
  });

  this.server.on('error', (err)=> {
    err.trace();
  });

  this.server.listen(this.port, ()=> {
    console.log('注册服务已经启动，监听端口：', this.port);
  });
};

CloudeerServer.prototype.arrangeServers = function () {

  console.log(this.clients.length);
  // this.clients.forEach(function (ele) {
  //   //console.log(ele.);
  // });
};

CloudeerServer.prototype.login = function (socket, username, password) {
  if (username == "test" && password == "test") {
    socket.write(JSON.stringify({errno: 0, cmd: 'login'}));
    this.clients.push(socket);
    console.log("有客户端加入，已经加入列队。");
  } else {
    console.error("登录错误，拒绝加入列队");
    socket.end('{"errno": 403, "errText": "登录失败，拒绝连接。"}');
    socket.destroy();
  }
};


module.exports = CloudeerServer;