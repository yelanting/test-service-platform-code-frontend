import axios from "../axios";

/*
 * 平台管理模块
 */

// 保存
export const save = data => {
    return axios({
        url: "/script/save",
        method: "post",
        data
    });
};
// 删除
export const batchDelete = data => {
    return axios({
        url: "/script/delete",
        method: "post",
        data
    });
};
// 分页查询
export const findPage = data => {
    return axios({
        url: "/script/findPage",
        method: "post",
        data
    });
};

// 根据应用id查询脚本
export const findPageByAppId = data => {
    return axios({
        url: "/script/findPageByAppId",
        method: "post",
        data
    });
};