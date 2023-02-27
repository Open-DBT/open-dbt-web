import { request } from 'umi';
import { API } from '@/common/entity/typings';

// <用户管理>查询角色列表(无分页)
export async function queryRole(params?: API.RoleListParams) {
  if (!params) {
    params = { current: 1, pageSize: 100, sorter: {}, filter: {} };
  }
  console.log('queryRole params ==', params);
  const result = await request<API.Result<API.PageHelper<API.RoleListItem>>>('/sys/getRole', { method: 'POST', data: params });
  return {
    data: result.obj.list,
    status: result.success,
  };
};

// 查询角色列表(参数分页)
export async function queryRolePage(params?: API.RoleListParams) {
  console.log('queryRolePage params ==', params);
  const result = await request<API.Result<API.PageHelper<API.RoleListItem>>>('/sys/getRole', { method: 'POST', data: { ...params } });
  return {
    data: result.obj.list,
    total: result.obj.total,
  }
};

// 添加和更新角色
export async function updateRole(params?: API.RoleListParams) {
  console.log('updateRole params ==', params);
  return request<API.Result<number>>('/sys/updateRole', { method: 'POST', data: { ...params } });
};

// 删除角色
export async function removeRole(roleId?: number) {
  console.log('removeRole roleId ==', roleId);
  return request<API.Result<number>>(`/sys/deleteRole/${roleId}`);
};

// 查询模块功能列表--树形菜单
export async function getResourceTree() {
  const result = await request<API.Result<any>>('/sys/getResourceTree');
  return result.obj
};

// 更新角色权限
export async function updateRoleResource(params?: API.RoleListParams) {
  console.log('updateRoleResource params ==', params);
  return request<API.Result<number>>('/sys/updateRoleResource', { method: 'POST', data: { ...params } });
};
