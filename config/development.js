module.exports = {
  debug                : true,
  app_name             : "cloudoll-server",
  port                 : 7654,
  controller_dirs      : ['/api/open', '/api/admin', '/api/inner'],
  schema_path          : './schema',
  my_errors_path       : './my-errors.js',
  koa_middles_forbidden: {
    clouderr_handle: false,
    auto_router    : false,
    json_validator : true,
    authenticate   : true
  },
  // cloudeer             : {
  //   type          : 'tcp', //可选 rest, tcp, zoo
  //   //host          : '112.74.29.211',
  //   host          : '127.0.0.1',
  //   port          : 2345,
  //   username      : 'knock',
  //   password      : 'password',
  //   not_a_consumer: false,
  //   not_a_service : false
  // }

};
