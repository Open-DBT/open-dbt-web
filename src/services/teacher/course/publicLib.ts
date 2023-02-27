// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { API } from '@/common/entity/typings';

export async function getPublicSceneList(params: API.PageParams) {
  const rs = await request<API.Result<API.PageHelper<API.PublicSceneRecord>>>(`/public/getScene`, { method: 'POST', data: { ...params } });
  return {
    data: rs.obj.list,
    total: rs.obj.total,
  }
}

export async function getSceneNameList() {
  console.log('getSceneNameList ');
  return request<API.Result<API.PublicSceneRecord[]>>(`/public/getSceneNameList`);
};

// 获取场景明细
export async function getSceneDetail(sceneId: number) {
  console.log('getSceneDetail sceneId ==', sceneId);
  return request<API.Result<API.PublicSceneRecord>>(`/public/getSceneDetail/${sceneId}`);
};


// 保存和修改场景
export async function updateScene(params?: API.PublicSceneRecord) {
  console.log('updateScene params ==', params);
  return request<API.Result<number>>('/public/updateScene', { method: 'POST', data: params });
};

// 删除场景
 export async function removeScene(sceneId: number) {
  console.log('removeScene sceneId ==', sceneId);
  return request<API.Result<number>>(`/public/deleteScene/${sceneId}`);
};

// 查询习题列表
export async function getPublicExerciseList(params?: API.PublicExerciseList) {
  console.log('getPublicExerciseList params ==', params);
  const rs = await request<API.Result<API.PageHelper<API.PublicExerciseList>>>('/public/getPublicExerciseList', { method: 'POST', data: { ...params, }});
  return {
      data: rs.obj.list,
      total: rs.obj.total,
  }
}

export async function getExerciseById(exerciseId: number) {
  console.log('getExerciseById exerciseId ==', exerciseId);
  return request<API.Result<API.PublicExerciseList>>(`/public/getPublicExerciseInfo/${exerciseId}`);
};

// 保存和修改习题
export async function updateExercise(params?: API.PublicExerciseList) {
  console.log('updateExercise params ==', params);
  return request<API.Result<number>>('/public/updateExercise', { method: 'POST', data: params });
};

// 删除习题
 export async function removeExercise(exerciseId: number) {
  console.log('removeExercise exerciseId ==', exerciseId);
  return request<API.Result<number>>(`/public/deleteExercise/${exerciseId}`);
};

// 测试运行答案
export function testRunAnswer(params: { sceneId: number | undefined, answer: string | undefined }) {
  console.log('testRunAnswer params ==', params);
  return request<API.Result<any>>('/public/testRunAnswer', { method: 'POST', data: params });
}

export async function importPublicExercise(params: { filePathList: string[] }) {
  console.log('importPublicExercise params ==', params);
  return await request('/public/importPublicExercise', { method: 'POST', data: { ...params } });
}

export async function exportPublicExerciseList() {
  console.log('exportPublicExerciseList');
  return await request('/public/exportPublicExercise');
}
