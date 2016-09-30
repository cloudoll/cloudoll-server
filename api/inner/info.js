const cloudoll = require('cloudoll');
const Cloudeer = cloudoll.Cloudeer;
const errors   = cloudoll.errors;

module.exports = {
  statistics  : function *() {
    var services = {};
    this.app.cloudeerServer.clients.forEach(function (ele) {
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

    let serviceKeys = Object.keys(services);
    let servers     = [];
    for (let key of serviceKeys) {
      for (let instance of services[key]['hosts']) {
        if (servers.indexOf(instance.host) < 0) {
          servers.push(instance.host);
        }
      }
    }
    this.echo({instances: services, servers: servers, services: serviceKeys});
  },
  allConfig : function *() {
    this.echo(Cloudeer.config);
  },
  // statistics: function *() {
  //   var config   = Cloudeer.config;
  //   let services = Object.keys(config);
  //   let xservers = [];
  //   for (let service of services) {
  //     for (let instance of config[service]['hosts']) {
  //       if (xservers.indexOf(instance.host) < 0) {
  //         xservers.push(instance.host);
  //       }
  //     }
  //   }
  //   var res = {
  //     services : services,
  //     servers  : xservers,
  //     instances: config
  //   };
  //   this.echo(res);
  // },
  serverInfo: function *() {
    var ip = this.qs.ip;
    if (!ip) {
      throw errors.WHAT_REQUIRE("ip");
    }
    this.tcpClient.serverInfo(ip);
    this.echo('unkown');

  },
  test      : function *() {
    this.echo(100);
  }
};

// var tempI = 0;
// setInterval(function () {
//   tempI++;
//   console.log(tempI);
// }, 2000);