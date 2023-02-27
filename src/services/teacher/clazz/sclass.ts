import { request } from 'umi';
import { API } from '@/common/entity/typings';

// 查询教师的未开始和进行中的班级
export async function getStartingSclassByTeacher() {
  return await request<API.Result<API.SclassRecord[]>>('/sclass/getClassListByTeacherId/0');
}

// 查询教师的已结课的班级
export async function getEndedSclassByTeacher() {
  return await request<API.Result<API.SclassRecord[]>>('/sclass/getClassListByTeacherId/1');
}

// 查询班级(课程)列表
export async function getAllSclassByStuId() {
  return await request<API.Result<API.SclassRecord[]>>('/sclass/getAllSclassByStuId');
}
// 查询班级(课程)列表改
export async function getAllSclassByStuIdExpectCourse() {
  return await request<API.Result<API.SclassRecord[]>>('/sclass/getAllSclassByStuIdExpectCourse');
}
// 查询课程最新进度
export async function getAllSclassProgressByStuId() {
  return await request<API.Result<API.SclassRecord[]>>('/sclass/getAllSclassProgressByStuId');
}
//根据id查询课程简介
export async function getSclassInfoById(sclassId: number) {
  return request<API.Result<API.SclassRecord>>(`/sclass/getSclassInfoById/${sclassId}`);
}

// 查询班级
export async function queryClass(
  params: {
    type?: number;
    current?: number;
    pageSize?: number;
    filter?: Record<string, any[]>;
    sorter?: Record<string, any>;
  }
) {
  console.log('queryClass params ==', params)
  const rs = await request('/sclass/getClassList', { method: 'POST', data: { ...params } });
  return {
    data: rs.obj.list,
    total: rs.obj.total,
  }
}

/**
 * 新增/修改班级
 * @param {*} params 
 * @returns 
 */
export async function updateClass(params: any) {
  return request<API.Result<API.SclassRecord>>('/sclass/updateClass', { method: 'POST', data: { ...params, } });
}

/**
 * 根据id查询班级
 * @param {*} sclassId 
 * @returns 
 */
export async function querySclass(sclassId: number) {
  return request<API.Result<API.SclassRecord>>(`/sclass/getSclass/${sclassId}`);
}

/**
 * 查询开班班级学生
 * @param {*} params 
 * @returns 
 */
export async function queryClassStu(
  params: {
    sclassId: number;
    name?: string;
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    filter?: Record<string, any[]>;
    sorter?: Record<string, any>;
  }
) {
  console.log('queryClassStu params ==', params)
  const rs = await request('/sclass/getSclassStu', {
    method: 'POST', data: { ...params, },
  });
  return {
    data: rs.obj.list,
    total: rs.obj.total,
  }
}

export async function queryClassStuNotPage(params: { sclassId: number, keyWord: string }) {
  const rs = await request('/sclass/getSclassStudentList', {
    method: 'POST', data: { ...params, },
  });
  return rs;
}


/**
 * 更新开班班级学生
 * @param {*} params 
 * @returns 
 */
export async function updateClassStu(params: API.SclassStuParam) {
  console.log('updateClassStu params ==', params)
  return await request<API.Result<string>>('/sclass/updateSclassStu', {
    method: 'POST', data: { ...params, },
  });
}

/**
 * 查询当前学生的课程
 * @param {*} params 
 * @returns 
 */
export async function querySclassByStu(
  params: {
    type: number;
    current?: number;
    pageSize?: number;
    filter?: Record<string, any[]>;
    sorter?: Record<string, any>;
  }
) {
  console.log('querySclassByStu params ==', params)
  const rs = await request('/sclass/getSclassByStu', {
    method: 'POST', data: { ...params, },
  });
  return {
    data: rs.obj.list,
    total: rs.obj.total,
  }
}

export async function importSclassStu(params: { sclassId: number; filePathList: string[] }) {
  console.log('importSclassStu params ==', params);
  return await request('/sclass/importSclassStu', { method: 'POST', data: { ...params } });
}

export async function deleteSclassStu(params: { userId: number; sclassId: string; }) {
  console.log('deleteSclassStu params ==', params);
  return await request('/sclass/deleteSclassStu', { method: 'POST', data: { ...params } });
}

/**
 * 根据老师id查询班级
 * @param {*} userId 
 * @returns 
 */
export async function getClass() {
  return request<API.Result<API.SclassListRecord[]>>(`/sclass/getClass`);
}
/**
 * 根据学生id查询班级
 * @param {*} userId 
 * @returns 
 */
export async function getSclassByStuId() {
  return request<API.Result<API.SclassListRecord[]>>(`/sclass/getSclassByStuId`);
}

/**
 * 根据id删除班级
 * @param id 班级id
 * @returns 
 */
export async function deleteSclassById(id: number) {
  return await request<API.Result<any>>(`/sclass/deleteSclassById/${id}`);
}

export async function getStuAnswerSituation(sclassId: number, userId: number) {
  console.log('getStuAnswerSituation');
  return await request<API.Result<API.Score[]>>(`/progress/getStuAnswerSituation/${sclassId}/${userId}`, { method: 'GET' });
}

export async function getStuScoreById(scoreId: number) {
  console.log('getStuScoreById');
  return await request<API.Result<API.Score>>(`/progress/getStuScoreById/${scoreId}`, { method: 'GET' });
}

/**
 * 批量删除学生
 */
export async function batchDelSclassStu(params: { userId: number[]; sclassId: string; }) {
  console.log('batchDelSclassStu params ==', params);
  return await request('/sclass/batchDelSclassStu', { method: 'POST', data: { ...params } });
}

export async function updateSclassIsOpen(params: { sclassId: number, classIsOpen: number }) {
  return await request<API.Result<number>>(`/sclass/updateSclassIsOpen/${params.sclassId}/${params.classIsOpen}`);
}

/**
 * 根据课程，查询全部班级
 * @param courseId 课程id
 * @returns 
 */
export async function getSclassByCourseId(courseId: number) {
  return request<API.Result<API.SclassListRecord[]>>(`/sclass/getSclassByCourseId/${courseId}`);
}
/**
 * 班级列表查询（根据当前登录人和课程id查询未结束的班级列表）
 * @param courseId 
 * @returns 
 */
export async function api_getClassByLoginUser(courseId: number) {
  return request<API.Result<API.SclassListRecord[]>>(`/courseCatalogue/getClassByLoginUser/${courseId}`);
}
