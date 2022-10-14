import request from './http'
import qs from 'qs'
// 列表数据
// export function _login(params) {
//   return request.post('/admin/admin/login', params)
// }
// 列表数据
export function _getMessageInfoList(params) {
  return request.get(
    "/cbp/mc/backlog/getBacklogInfoByPage?" + qs.stringify(params)
  );
}
// 发送消息
export function _sendMessageInfo(params) {
  return request.post("/cbp/mc/backlog/saveMessage", params);
}