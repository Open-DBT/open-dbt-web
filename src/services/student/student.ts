// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { API } from '@/common/entity/typings';

/**
 * 查询自己的作业列表
 * @param classId 班级id
 * @param courseId 课程id
 * @returns 
 */
export async function getExamListBySclass(clazzId: number, courseId: number) {
  return await request<API.Result<API.ExamListRecord[]>>(`/student/exam/getExamListBySclass/${clazzId}/${courseId}`);
}

/**
 * 查询作业习题
 * @param classId 班级id，用于定位答题表中唯一，可能出现同一个作业同一个学生2个班
 * @param examId 作业id
 * @returns 
 */
export async function getExamExerciseList(classId: number, examId: number) {
  return await request<API.Result<API.StudentExamExercise[]>>(`/student/exam/getExamExerciseList/${classId}/${examId}`);
}

export async function getExerciseReportCard(examClassId: number) {
  return await request<API.Result<API.StudentReportCard>>(`/student/exam/exerciseReportCard/${examClassId}`);
}
/**
 * 查询习题详情
 * @param examId 
 * @param exerciseId 
 * @returns 
 */
export async function getExamExerciseById(sclassId: number, examId: number, examClassId: number, exerciseId: number) {
  return await request<API.Result<API.StudentExamExercise>>(`/student/exam/getExamExerciseById/${sclassId}/${examId}/${examClassId}/${exerciseId}`);
}
/**
 * 测试运行答案
 * @param {*} params 
 * @returns 
 */
export async function examStuTestRunAnswer(params: { answer: string, usageTime: number, exerciseId: number, examId: number, examClassId: number }) {
  console.log('examStuTestRunAnswer params ==', params)
  return await request('/student/exam/examStuTestRunAnswer', { method: 'POST', data: { ...params } });
}

/**
* 答题提交答案
* @param {*} params 
* @returns 
*/
export async function examSubmitAnswer(params: { answer: string, usageTime: number, exerciseId: number, sclassId: number, examId: number, examClassId: number }) {
  console.log('examSubmitAnswer params ==', params)
  return await request('/student/exam/examSubmitAnswer', { method: 'POST', data: { ...params, }, });
}

//根据作业ID查询作业详情
export async function getExamById(examClassId: number) {
  return await request<API.Result<API.ExamClassListRecord>>(`/student/exam/getExamById/${examClassId}`);
}

