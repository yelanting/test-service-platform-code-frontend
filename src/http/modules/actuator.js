import axiosActuator from "../axiosActuator";

/*
 * 应用管理模块
 */

// 分页查询
export const findPage = data => {
  return axios({
    url: "/app/findPage",
    method: "post",
    data
  });
};

/**
 * 获取所有app
 * @param  params
 */
export const findAll = params => {
  return axios({
    url: "/app/findAll",
    method: "get",
    params
  });
};

/**
 * @param  params
 */
export const getActuatorList = params => {
  return axiosActuator({
    url: "/actuator",
    method: "get",
    params
  });
};
