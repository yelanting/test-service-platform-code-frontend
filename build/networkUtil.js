const os = require("os");
function getLocalIp () {

  let localIp = '';
  try {
    var interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
      let eachNetwork = interfaces[devName];
      console.log(eachNetwork);
      if ("本地连接" === devName) {
        for (var i = 0; i < eachNetwork.length; i++) {
          var alias = eachNetwork[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            localIp = alias.address;
            break;
          }
        }
      }

    }
  } catch (e) {
    localIp = "localhost";
  }

  console.log("当前的ip为:" + localIp);
  return localIp;
}


const localIp = getLocalIp();

exports.localIp = localIp;

