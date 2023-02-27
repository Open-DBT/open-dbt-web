// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { API } from '@/common/entity/typings';

export async function add(params: API.FeedbackForm) {
  return request<API.Result<number>>('/feedback/add', { method: 'POST', data: { ...params } });
}

export async function getFeedbackList(params: API.PageParams) {
  console.log('queryOwnCourse params ==', params)
  const rs = await request<API.Result<API.PageHelper<API.FeedbackListRecord>>>('/feedback/getFeedbackList', { method: 'POST', data: { ...params } });
  return {
      data: rs.obj.list,
      total: rs.obj.total,
  }
}
