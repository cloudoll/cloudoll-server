const crypto = require('crypto');

module.exports = {

  md5       : function (str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
  },
  computePwd: function (u, p) {
    return this.md5(u + p);
  }
};