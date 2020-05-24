import axios from "../axios";

/*
 * 应用管理模块
 */

// 保存
export const save = data => {
    return axios({
        url: "/app/save",
        method: "post",
        data
    });
};
// 删除
export const batchDelete = data => {
    return axios({
        url: "/app/delete",
        method: "post",
        data
    });
};
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