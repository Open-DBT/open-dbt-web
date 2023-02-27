// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { API } from '@/common/entity/typings';

//根据课程查询作业列表
export async function getExamList(courseId: number) {
  return await request<API.Result<API.ExamListRecord[]>>(`/teacher/exam/getExamList/${courseId}`);
}
//根据作业ID查询作业详情
export async function getExamById(examId: number) {
  return await request<API.Result<API.ExamListRecord>>(`/teacher/exam/getExamById/${examId}`, { method: 'GET' });
}
//根据作业id，查询习题列表
export async function getExamExerciseByExamId(examId: number) {
  return await request<API.Result<API.ExamExerciseListRecord[]>>(`/teacher/exam/getExamExerciseByExamId/${examId}`, { method: 'GET' });
}

//保存作业习题
export async function saveExamExercise(examId: number, ids: number[]) {
  const exerciseIds = ids;
  return await request<API.Result<void>>(`/teacher/exam/saveExamExercise/${examId}`, { method: 'POST', data: { exerciseIds } });
}

//作业习题位置调整
export async function sortExercise(id: number, newIndex: number) {
  return await request<API.Result<void>>(`/teacher/exam/sortExercise/${id}/${newIndex}`, { method: 'GET' });
}

/**
 * 批量删除作业习题
 * @param ids 关联表id
 * @returns 
 */
export async function batchDelExamExercise(examId: number, ids: number[]) {
  const exerciseIds = ids;
  return await request<API.Result<void>>(`/teacher/exam/batchDelExamExercise/${examId}`, { method: 'POST', data: { exerciseIds } });
}

//更新作业详情
export async function updateExam(params: { id: number, testName: string, testDesc: string, courseId: number }) {
  return await request<API.Result<number>>(`/teacher/exam/updateExam`, { method: 'POST', data: { ...params } });
}

//根据id删除作业
export async function deleteExam(examId: number) {
  return await request<API.Result<number>>(`/teacher/exam/deleteExam/${examId}`);
}

/**
 * 根据作业id，批量保存习题得分
 * @param examId 
 * @param exerciseIds 
 * @param values 
 * @returns 
 */
export async function saveExamExerciseScore(examId: number, exerciseIds: number[], values: number[]) {
  return await request<API.Result<void>>(`/teacher/exam/saveExamExerciseScore/${examId}`, { method: 'POST', data: { ids: exerciseIds, values: values } });
}

/**
 * 保存作业指定班级
 * @param examId 
 * @param classIds 
 * @returns 
 */
export async function saveExamClass(examClass: API.ExamClassListRecord) {
  return await request<API.Result<void>>(`/teacher/exam/saveExamClass`, { method: 'POST', data: { ...examClass } });
}

/**
 * 根据课程id，查询现有作业班级
 * @param examId 
 * @returns 
 */
export async function getExamClassListByCourseId(courseId: number) {
  return await request<API.Result<API.ExamClassListRecord[]>>(`/teacher/exam/getExamClassListByCourseId/${courseId}`);
}

/**
 * 根据班级id，查询现有作业班级
 * @param examId 
 * @returns 
 */
 export async function getExamClassListByClassId(classId: number) {
  return await request<API.Result<API.ExamClassListRecord[]>>(`/teacher/exam/getExamClassListByClassId/${classId}`);
}

/**
 * 根据id，删除发放的班级作业
 * @param examClassId 
 * @returns 
 */
export async function deleteExamClassById(examClassId: number) {
  return await request<API.Result<number>>(`/teacher/exam/deleteExamClassById/${examClassId}`);
}

/**
 * 根据作业课程表id，查询学生每个人得分
 * @param examClassId 
 * @returns 
 */
export async function getExamStudentReportCard(examClassId: number) {
  return await request<API.Result<API.ExamStudentReportCard[]>>(`/teacher/exam/getExamStudentReportCard/${examClassId}`);
}

/**
 * 根据作业班级表id，查询作业详情和统计
 * @param examClassId 
 * @returns 
 */
export async function getExamDetailByExamClassId(examClassId: number) {
  return await request<API.Result<API.StudentReportCard>>(`/teacher/exam/getExamDetailByExamClassId/${examClassId}`);
}
/**
 * 查询某个学生、某个作业答题历史记录
 * @param examClassId 
 * @param userId 
 * @returns 
 */
export async function getStudentExerciseReportCard(examClassId: number,userId:number) {
  return await request<API.Result<API.ExamStudentAnswerHistoryRecord[]>>(`/teacher/exam/getStudentExerciseReportCard/${examClassId}/${userId}`);
}

export async function getExerciseScoreById(scoreId: number) {
  console.log('getExerciseScoreById');
  return await request<API.Result<API.Score>>(`/teacher/exam/getExerciseScoreById/${scoreId}`);
}
