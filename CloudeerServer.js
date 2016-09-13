const net   = require('net');
const fs    = require('fs');
const os    = require('os');
const share = require('./share');
var methods = require('./methods');

const sendJson = function (socket, json) {
  socket.write(JSON.stringify(json) + os.EOL);
};


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

    socket.chunk = ""; //每个 socket 得到的消息存在自己的对象你，nodejs 你好牛。

    socket.on('data', (data)=> {
      socket.chunk += data.toString();
      let d_index = socket.chunk.indexOf(os.EOL);
      if (d_index > -1) {
        socket.chunk = socket.chunk.substring(0, d_index);
        // console.log(socket.chunk);
        // var jsonInfo;
        try {
          let jsonInfo = JSON.parse(socket.chunk);
          socket.chunk = socket.chunk.substr(d_index + 1);

          if (!jsonInfo.cmd) {
            console.error("错误的消息体，缺少 cmd 参数。");
          } else {
            switch (jsonInfo.cmd) {
              case "login":
                _this.login(socket, jsonInfo.data.username, jsonInfo.data.password);
                break;
              case "reg-service":
                _this.regService(socket, jsonInfo.data);
                break;
              case "reg-methods":
                _this.regMethods(jsonInfo.data);
                break;
            }
          }
        } catch (e) {
          console.error("错误的数据，必须提供 json 格式的数据。");
        }

      }

    });


    socket.on('end', ()=> {
      var tag = socket && socket.tag && socket.tag.appName;
      console.log(tag || "未命名", '微服务已经退出');
      _this.clients.splice(_this.clients.indexOf(socket), 1);
      _this.onServicesChanged();
    });
  });

  this.server.on('error', (err)=> {
    console.error(err);
  });

  this.server.listen(this.port, ()=> {
    console.log('注册服务已经启动，监听端口：', this.port);
  });

};

//向每一台客户端发布服务器列表
CloudeerServer.prototype.onServicesChanged = function () {
  console.log('微服务发生变化...');
  console.log('当前微服务数量：', this.clients.length);
  console.log('其中纯消费的服务：', this.clients.filter(function (ele) {
    return !(ele.tag && ele.tag.notAConsumer);
  }).length);
  var services = {};
  this.clients.forEach(function (ele) {
    if (ele.tag) {
      if (!services.hasOwnProperty(ele.tag.appName)) {
        services[ele.tag.appName]          = {};
        services[ele.tag.appName]['hosts'] = [];
      }
      services[ele.tag.appName]['hosts'].push({
        host   : ele.tag.host,
        port   : ele.tag.port,
        baseUri: ele.tag.baseUri
      });
    }
  });

  console.log("微服务的数量：", Object.keys(services).length);

  this.clients.forEach(function (socket) {
    //console.log(socket.tag);
    if (!(socket.tag && socket.tag.notAConsumer)) {
      sendJson(socket, {errno: 0, cmd: 'get-services', data: services});
    }
  }.bind(this));
};

CloudeerServer.prototype.login = function (socket, username, password) {
  let rightAccess = false;
  try {
    fs.accessSync('./pwd', fs.F_OK);
    rightAccess = true;
  } catch (e) {
  }

  let passed = false;
  //密码文件不存在，直接通过
  if (!rightAccess) {
    passed = true;
  } else {
    var pwds     = fs.readFileSync('./pwd');
    var pwdsJson = JSON.parse(pwds);

    if (pwdsJson.hasOwnProperty(username)) {
      if (pwdsJson[username] == share.computePwd(username, password)) {
        passed = true;
      }
    }
  }

  if (passed) {
    sendJson(socket, {errno: 0, cmd: 'login'});
    this.clients.push(socket);
    console.log("有客户端加入并成功登录，已经加入列队。");
  } else {
    console.error("登录错误，拒绝加入列队");
    sendJson(socket, {errno: 403, errText: '登录失败，连接被拒。'});
    socket.destroy();
  }
};

CloudeerServer.prototype.regService = function (socket, tag) {
  console.log("微服务", tag.appName, "已经注册成功。");
  socket.tag = tag;
  this.onServicesChanged();
};

CloudeerServer.prototype.regMethods = function (data) {
  console.log("现在有方法注册进来了！");
 if (!data.hasOwnProperty('service')){
   console.error('JSON 数据中需要参数 service。');
   return false;
 }
  if (!data.hasOwnProperty('methods')){
    console.error('JSON 数据中需要参数 methods。');
    return false;
  }

  var whichOne = -1;
  methods.filter(function (ele, index) {
    if (ele.service.toLocaleLowerCase() == data.service.toLowerCase()) {
      whichOne = index;
      return true;
    }

    if (whichOne >= 0) {
      methods.splice(whichOne, 1);
    }

    methods.push(data);
  });

};

module.exports = CloudeerServer;