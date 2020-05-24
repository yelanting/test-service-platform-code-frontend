import axios from "../axios";

/*
 * 应用管理模块
 */

// 保存
export const save = data => {
  return axios({
    url: "/zenTaoTestCase/save",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/zenTaoTestCase/delete",
    method: "post",
    data
  });
};
// 分页查询
export const findPage = data => {
  return axios({
    url: "/zenTaoTestCase/findPage",
    method: "post",
    data
  });
};

/**
 * 获取所有zenTaoTestCase
 * @param  params
 */
export const findAll = params => {
  return axios({
    url: "/zenTaoTestCase/findAll",
    method: "get",
    params
  });
};


/**
 * 获取所有zenTaoTestCase
 * @param  params
 */
export const findByTestTaskId = params => {
  return axios({
    url: "/zenTaoTestCase/findByTestTaskId",
    method: "get",
    params
  });
};


/**分页查询 */
export const findPageByTestTaskId = data => {
  return axios({
    url: "/zenTaoTestCase/findPageByTestTaskId",
    method: "post",
    data
  });
};
