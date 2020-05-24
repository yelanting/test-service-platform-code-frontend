import axios from "../axios";

/*
 * 专属禅道配置模块
 */

// 保存
export const save = data => {
  return axios({
    url: "/zenTaoConfig/save",
    method: "post",
    data
  });
};

/**
 * 获取所有zenTaoConfig
 * @param  params
 */
export const getCurrentZenTaoData = params => {
  return axios({
    url: "/zenTaoConfig/getCurrentZenTaoData",
    method: "get",
    params
  });
};
