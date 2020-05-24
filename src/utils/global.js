/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
const defaultSettings = require('../configs/settings')
const globalSettings = require("../../config/GlobalSettings");
// 后台管理系统服务器地址
// export const baseUrl = 'http://139.196.87.48:8098'
// api接口请求地址
export const baseUrl = globalSettings.GlobalBaseUrl;

// 系统数据备份还原服务器地址
// export const backupBaseUrl = 'http://139.196.87.48:8002'
export const backupBaseUrl = 'http://localhost:8002'

export default {
  baseUrl,
  backupBaseUrl,
  settings: defaultSettings
}
