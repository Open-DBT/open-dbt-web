import { request } from 'umi';
import { API } from '@/common/entity/typings';

// 查询用户列表
export async function queryUser(params?: API.UserListParams) {
  // console.log('queryUser params ==', params)
  const rs = await request<API.Result<API.PageHelper<API.UserListItem>>>('/sys/getUser', { method: 'POST', data: params });
  return {
    data: rs.obj.list,
    total: rs.obj.total,
  }
};

// 新增用户
export async function addUser(params?: API.UserListParams) {
  // console.log('addUser params ==', params)
  const rs = await request<API.Result<number>>('/sys/updateUser', { method: 'POST', data: params });
  return {
    status: rs.success,
    message: rs.message
  }
};

// 修改用户信息不操作关联的角色
export async function updateCenter(params?: API.UserListParams) {
  // console.log('updateCenter params ==', params)
  return await request<API.Result<number>>('/sys/updateUserCenter', { method: 'POST', data: params });
};

// 重置密码
export async function resetPwd(params?: API.CurrentUser) {
  // console.log('resetPwd params ==', params)
  const rs = await request<API.Result<number>>('/sys/resetUserPassword', { method: 'POST', data: params });
  return {
    status: rs.success,
    message: rs.message
  }
};

// 暂停/恢复  0正常 1停用
export async function isStop(params?: API.UserListParams) {
  // console.log('isStop params ==', params)
  const rs = await request<API.Result<number>>('/sys/updateUserIsStop', { method: 'POST', data: params });
  return {
    status: rs.success,
    message: rs.message
  }
};

// 切换角色
export async function switchRoles(params?: API.UserListParams) {
  // console.log('switchRoles params ==', params)
  return await request<API.Result<number>>('/sys/updateUserDefRole', { method: 'POST', data: params });
};

/**
 * 根据<班级id>和<code>查询学生
 * 教师--学生统计
 * @param params 
 * @returns 
 */
export async function getStuBySclassAndCode(params: {sclassId: number; code: string}) {
  // console.log('getStuBySclassAndCode params ==', params)
  return await request<API.Result<API.UserListItem[]>>('/sys/getStuBySclassAndCode', { method: 'POST', data: params });
};

// 修改账号信息
export async function updateAccountInfo(params?: API.UserListParams) {
  // console.log('updateAccountInfo params ==', params)
  return await request<API.Result<number>>('/sys/updateAccountInfo', { method: 'POST', data: params });
};

// 用户修改密码
export async function userUpdatePassword(params?: API.UserListParams) {
  // console.log('userUpdatePassword params ==', params)
  return await request<API.Result<number>>('/sys/userUpdatePassword', { method: 'POST', data: params });
};

// 获取教师
export async function getTeachers() {
  return await request<API.Result<API.UserListItem[]>>('/sys/getTeachers');
};
