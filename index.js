var program = require('commander');

program
  .version('0.0.1')
  .option('-p, --port [type]', 'Server port')
  .parse(process.argv);


var port = program.port || 2345;

//----------

const CloudeerServer = require('./CloudeerServer');


var server = new CloudeerServer({port: port});

server.startService();