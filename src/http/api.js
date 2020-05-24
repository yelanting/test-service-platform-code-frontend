/*
 * 接口统一集成模块
 */
import * as login from "./modules/login";
import * as user from "./modules/user";
import * as dept from "./modules/dept";
import * as role from "./modules/role";
import * as menu from "./modules/menu";
import * as dict from "./modules/dict";
import * as config from "./modules/config";
import * as log from "./modules/log";
import * as loginlog from "./modules/loginlog";
import * as register from "./modules/register";
import * as platform from "./modules/platform";
import * as script from "./modules/script";

import * as apk from "./modules/apk";

import * as accessLog from "./modules/accessLog"
import * as timerTaskPolicy from "./modules/timerTaskPolicy"
import * as timerTask from "./modules/timerTask"
import * as timerTaskMonitor from "./modules/timerTaskMonitor"

import * as actuator from "./modules/actuator"

import * as globalParam from "./modules/globalParam";
import * as zenTaoTestTask from "./modules/zenTaoTestTask";
import * as zenTaoTestCase from "./modules/zenTaoTestCase";
import * as zenTaoConfig from "./modules/zenTaoConfig";


// 默认全部导出
export default {
  login,
  user,
  dept,
  role,
  menu,
  dict,
  config,
  log,
  loginlog,
  apk,
  register,
  platform,
  script,
  accessLog,
  timerTaskPolicy,
  timerTask,
  timerTaskMonitor,
  actuator,
  globalParam,
  zenTaoTestTask,
  zenTaoTestCase,
  zenTaoConfig
};
