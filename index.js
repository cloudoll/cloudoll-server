const CloudeerServer = require('./CloudeerServer');


var server = new CloudeerServer({port: 2345});

server.startService();