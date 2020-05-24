import axios from "../axios";

/*
 * 应用管理模块
 */

// 保存
export const save = data => {
  return axios({
    url: "/timerTask/save",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/timerTask/delete",
    method: "post",
    data
  });
};
// 分页查询
export const findPage = data => {
  return axios({
    url: "/timerTask/findPage",
    method: "post",
    data
  });
};

/**
 * 获取所有timerTask
 * @param  params
 */
export const findAll = params => {
  return axios({
    url: "/timerTask/findAll",
    method: "get",
    params
  });
};
