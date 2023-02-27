import { request } from 'umi';
import { TASK } from '@/common/entity/task';
import { API } from '@/common/entity/typings';
// 学生
// 获取作业列表
export async function getHomeWrokByStudent(data: TASK.TaskListParamByStu) {
    return await request('/homeWork/getHomeWrokByStudent', { method: 'POST', data });
}
// 作答详情
export async function review(data:TASK.ReviewDataParamByTeach) {
    return await request<API.Result<TASK.ReviewData>>(`/homeWork/review`, { method: 'POST', data });
}
// 学生端提交接口
export async function submitHomeWrok(data: any) {
    return await request(`/homeWork/submitHomeWrok`, { method: 'POST', data });
}
// 学生端保存接口
export async function saveHomeWrok(data: any) {
    return await request(`/homeWork/saveHomeWrok`, { method: 'POST', data });
}

