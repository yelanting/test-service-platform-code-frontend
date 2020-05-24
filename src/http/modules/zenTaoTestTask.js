import axios from "../axios";

/*
 * 应用管理模块
 */

// 保存
export const save = data => {
  return axios({
    url: "/zenTaoTestTask/save",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/zenTaoTestTask/delete",
    method: "post",
    data
  });
};
// 分页查询
export const findPage = data => {
  return axios({
    url: "/zenTaoTestTask/findPage",
    method: "post",
    data
  });
};

/**
 * 获取所有zenTaoTestTask
 * @param  params
 */
export const findAll = params => {
  return axios({
    url: "/zenTaoTestTask/findAll",
    method: "get",
    params
  });
};

/**
 * 获取当前用户所属的
 */
export const filterCurrentTestTask = data=>{
  return axios({
    url: "/zenTaoTestTask/findPageOfCurrentUser",
    method: "post",
    data
  });
}