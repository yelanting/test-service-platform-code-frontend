import axios from '../axios'

/* 
 * 注册
 */

// register
export const register = (data) => {
    return axios({
        url: '/register',
        method: 'post',
        data
    })
}