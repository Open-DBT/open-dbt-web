import { request } from 'umi';
import { API } from '@/common/entity/typings';
import { QUESTION_BANK } from '@/common/entity/questionbank';
/**
 * 题库-习题保存接口
 * @param courseId 课程id
 * @param parentId： 父级课程目录id
 * @param ，catalogueName：目录名称
 * @returns 
 */
 export async function saveExercise(data: QUESTION_BANK.QuestionExercise) {
    return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/exercise/saveExercise`, { method: 'POST', data: data });
  }
/**
 * 题库-习题详情查询接口
 * @param exerciseId 习题id
 * @returns 
 */
 export async function getExerciseInfo(exerciseId: number) {
  return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/exercise/getExerciseInfo/${exerciseId}`);
}
// 复制题目
export function copyExercise(exerciseId: number) {
  return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/exercise/copyExercise/${exerciseId}`);
}
// 删除习题
export function deleteExercise(exerciseId: number) {
  return request<API.Result<boolean>>(`/exercise/deleteExercise/${exerciseId}`);
}

// 文件夹保存
export function saveExerciseCatalogue(data:{ courseId: number, parentId: number | undefined, elementType: number, exerciseName: string, id: string | number }) {
  return request<API.Result<boolean>>(`/exercise/saveExerciseCatalogue`,  { method: 'POST', data: data });
}

// 文件夹目录
export function getExerciseCatalogueTree(data: { courseIdList: number []}) {
  return request<API.Result<QUESTION_BANK.QuestionExercise []>>(`/exercise/getExerciseCatalogueTree`,  { method: 'POST', data: data });
}
//
/**
 * 题库习题位置调整
 * @param id  原始id
 * @param tid 目标id
 * @returns 
 */
export async function moveExercise(oid: number, tid: number) {
  return await request<API.Result<boolean>>(`/exercise/moveExercise/${oid}/${tid}`, { method: 'GET' });
}
// 一键导出
export function exportExercise(courseId: number) {
  return request<API.Result<any>>(`/exercise/exportExercise/${courseId}`);
}