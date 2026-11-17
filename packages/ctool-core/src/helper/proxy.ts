import _axios from "axios";

// 代理已废弃，直接返回标准 axios 实例
export const axios = () => {
    return _axios.create();
};
