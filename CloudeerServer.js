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
    socket.on('end', ()=> {
      console.log(socket.serviceName || "未命名", '微服务已经退出');
      _this.clients.splice(_this.clients.indexOf(socket), 1);
    });

    socket.on('data', (data)=> {
      // var lala           = JSON.parse(data.toString());
      // socket.serviceName = lala.name;
      console.log(data.toString());
      socket.tag = JSON.parse(data.toString());
      _this.clients.push(socket);

      console.log(_this.clients.length);
      _this.clients.forEach(function (ele) {
        console.log(ele.tag);
      });
    });
  });

  this.server.on('error', (err)=> {
    err.trace();
  });

  this.server.listen(this.port, ()=> {
    console.log('注册服务已经启动，监听端口：', this.port);
  });
};

module.exports = CloudeerServer;