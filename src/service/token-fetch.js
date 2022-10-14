import axios from "axios";
import {ElMessage} from "element-plus";

export const TOKEN_CACHE_KEY = "_javaToken"
export const USER_INFO_CACHE_KEY = "_javaUserInfo"

/** 写死账号获取token,后端反馈"目前有且仅有一个用户使用,不会冲突"(是么?)
 * 测试环境账号
 * */
export const loginUserDev = {"authType":"1","account":"lyh","content":"YmWRGsnDhkdkJCI6s7DULHKXQk1Yhs8ETXzgyWne8UAoCHVglH33mKkIYJz5HuMI7MO+o9mI6QyxHH+0vdY69X9eiKKRHPJr/xtza1wEMPBDG0UoHLJbGG9z7WAOBh0egpCt9n0KOVMQm48QvtRjcQtZnF0wEYk+ttCUoL7AMcI=","captchaId":"tqeWeOIr5xelMuolNuE2o71A3CTKtCHR","captcha":"mgpm"}

/** 正式环境账号,待添加*/
export const loginUserProduction = {
	//todo 添加正式环境账号
}

export async function refreshToken(refreshToken) {
	return axios.post('/cbp/omc/operator/updateSession', {refreshToken}).then(resp => {
		const {data: result} = resp;
		if(result.code === 0){
			localStorage.setItem(TOKEN_CACHE_KEY, result?.data?.accessToken);
			const userInfoCache = localStorage.getItem(USER_INFO_CACHE_KEY);
			if(userInfoCache){
				localStorage.setItem(JSON.stringify({...JSON.parse(userInfoCache), ...result?.data}))
			}
			return result.data;
		}else{
			ElMessage.error('刷新用户token失败');
			return Promise.reject(new Error('刷新用户token失败'))
		}
	})
}

export async function fetchSession() {
	const cache = localStorage.getItem(USER_INFO_CACHE_KEY);
	if(cache){
		const parseCache = JSON.parse(cache);
		if(Date.now() < new Date(parseCache?.accessTokenExpire)){
			return parseCache;
		}else{
			return await refreshToken(parseCache?.refreshToken)
		}
	}
	//todo 如果有正式环境账号了就加一下process.env的判断
	return axios.post('/cbp/omc/operator/saveLogin', loginUserDev).then(resp => {
		const {data: result} = resp;
		if(result.code === 0){
			localStorage.setItem(TOKEN_CACHE_KEY, result?.data?.accessToken);
			localStorage.setItem(USER_INFO_CACHE_KEY, JSON.stringify(result?.data));
			return result?.data;
		}else{
			ElMessage.error('获取用户token失败');
			return Promise.reject(new Error('获取用户token失败'))
		}
	});
}

/** token过期或者账号被占用则重发*/
export function createBatchReplay() {
	let replayPool = [],timer;
	const onRefresh = (axios) => {
		return new Promise((resolve) => {
			clearTimeout(timer);
			timer = null;
			timer = setTimeout(async () => {
				localStorage.clear()
				await fetchSession();
				//todo 重发似乎没什么意义
				replayPool.forEach((config) => axios.request(config))
				replayPool = [];
				resolve()
			}, 50)
		})
	}
	
	return {
		replayPool,
		onRefresh
	}
}
