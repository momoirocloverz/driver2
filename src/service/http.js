import axios from "axios";
import config from "./config"
import router from '@/router'
import {ElMessage} from 'element-plus'
import {TOKEN_CACHE_KEY, createBatchReplay} from "@/service/token-fetch";
const {replayPool, onRefresh} = createBatchReplay()

const Http = axios.create({
  baseURL: config.publicUrl,
  timeout: config.timeout,
  headers: {
    Accept: config.version,
  },
  // params: {
  //   version: "1.0.0",
  // },
});

Http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_CACHE_KEY);
    if(token){
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
Http.interceptors.response.use(
  async (res) => {
    let errcode = res.data.code;
    if (errcode === 0) {
      return res.data;
    } else if (errcode === 21001 || errcode === 401) {
      localStorage.clear()
      router.replace({name: 'login'})
    } else if (errcode === 500) {
      ElMessage.error('服务器异常')
    } else {
      ElMessage.error(res.data.msg)
    }
  },
  async (error) => {
    const {code} = error?.response?.data
    if (error?.response?.status === 401 && error?.config?.url?.startsWith('/cbp') && (code === 104012 || code === 104020)) {
      replayPool.push(error.config)
      await onRefresh(Http);
      return
    }
    return Promise.reject(error);
  }
);

export default Http;
