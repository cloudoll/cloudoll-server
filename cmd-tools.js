const os = require('os');

let cmdTools = module.exports = {
  handleMonitorCmd: function (jsonInfo, owner, clients) {
    let cmd = jsonInfo.cmd;
    if (cmd == 'mnt-server-info' && jsonInfo.data) {
      //这里的 owner 是 不是 监视服务的
      console.log("准备回应：", jsonInfo.data);

      let client;
      for (let i = 0; i < clients.length; i++) {
        let socket = clients[i];
        if (socket.id === jsonInfo.sid) {
          client = socket;
          break;
        }
      }
      if (client) {
        cmdTools.sendJson(client, {
          errno: 0,
          cmd  : 'mnt-server-info-response',
          data  : jsonInfo.data
        });
      }

      return;
    }
    if (cmd.startsWith('mnt-server-info')) {
      var ip = cmd.split('~')[1];

      let client;
      for (let i = 0; i < clients.length; i++) {
        let socket = clients[i];
        if (socket.tag && socket.tag.host == ip) {
          client = socket;
          break;
        }
      }
      if (client) {
        cmdTools.sendJson(client, {
          errno: 0,
          cmd  : 'mnt-server-info',
          sid  : client.id
        });
      }
    }
  },
  sendJson        : function (socket, json) {
    socket.write(JSON.stringify(json) + os.EOL);
  }
};