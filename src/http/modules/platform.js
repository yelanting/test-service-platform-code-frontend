import axios from "../axios";

/*
 * 平台管理模块
 */

// 保存
export const save = data => {
    return axios({
        url: "/platform/save",
        method: "post",
        data
    });
};
// 删除
export const batchDelete = data => {
    return axios({
        url: "/platform/delete",
        method: "post",
        data
    });
};
// 分页查询
export const findPage = data => {
    return axios({
        url: "/platform/findPage",
        method: "post",
        data
    });
};

// 获取所有
export const findAll = params => {
    return axios({
        url: "/platform/findAll",
        method: "get",
        params
    });
};