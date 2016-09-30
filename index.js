var program = require('commander');
const cloudoll = require('cloudoll');

program
  .version('0.0.1')
  .option('-p, --port [type]', 'Server port')
  .option('-d, --doctor', 'Docktor mode')
  .parse(process.argv);


var port = program.port || 2345;

//----------

const CloudeerServer = require('./CloudeerServer');
var server           = new CloudeerServer({port: port});
server.startService();

if (program.doctor) {
  const logger = cloudoll.logger;
  const tools = cloudoll.tools;
  tools.info('启动监视和医生模式...');

  setTimeout(function () {
    let app = cloudoll.KoaApplication();
    app.cloudeerServer = server;
  }, 4000);

}