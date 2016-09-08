const program = require('commander');


program
  .version('0.0.1')
  .option('-u, --username [type]', '用户名（必填）')
  .option('-p, --password [string]', '密码（必填）');

program.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    $ node add-user -u username -p password');
  console.log('');
});


program.parse(process.argv);

let username = program.username;
let password = program.password;


if (!username || !password || typeof username != 'string' || typeof password != 'string') {
  program.help();
  return;
}

//--------------------------

const fs    = require('fs');
const share = require('./share');


let rightAccess = false;
try {
  fs.accessSync('./pwd', fs.F_OK);
  rightAccess = true;
} catch (e) {
  console.warn("文件 [./pwd] 不存在，现在创建。");
}
if (!rightAccess) {
  fs.writeFileSync('./pwd', '{}');
}


fs.readFile("./pwd", (err, data)=> {
  if (err) throw err;
  let xJson = JSON.parse(data);
  if (xJson.hasOwnProperty(username)) {
    console.log("该用户名已经存在");
    return false;
  } else {
    xJson[username] = share.computePwd(username, password);
  }
  fs.writeFileSync('./pwd', JSON.stringify(xJson));

  console.log("用户创建成功!");
});

