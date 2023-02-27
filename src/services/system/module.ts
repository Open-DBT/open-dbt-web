import { request } from 'umi';
import { API } from '@/common/entity/typings';

// 分页查询模块
export async function queryModule(params?: API.ModuleListParams) {
  console.log('queryModule params ==', params);
  const result = await request<API.Result<API.PageHelper<API.ModuleListItem>>>('/sys/getResource', { method: 'POST', data: { ...params } });
  return {
    data: result.obj.list,
    total: result.obj.total,
  }
};
