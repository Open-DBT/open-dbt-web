import { request } from 'umi';
import { API } from '@/common/entity/typings';
/**
 * 查询学生当前课程学习进度
 * 学生-课程--学习进度
 * @param {*} params
 * @returns
 */
export async function getCourseProgress(courseId: number) {
  console.log('getCourseProgress courseId ==', courseId);
  return await request<API.Result<number>>(`/progress/getCourseProgress/${courseId}`);
}

// 根据课程id，查询课程每个知识点习题总数
export async function getKnowExerciseCountByCourseId(courseId: number) {
  return request<API.Result<API.KnowledgeItemExerciseCount[]>>(
    `/progress/getKnowExerciseCountByCourseId/${courseId}`,
  );
}

/**
 * 查询班级统计--tab1 正确率 习题列表 | 答对人数、答题人数、全班人数
 * @param sclassId
 * @returns
 */
export async function getSclassCorrect(sclassId: number) {
  console.log('getSclassCorrect sclassId ==', sclassId);
  if (sclassId === -1) return;
  const rs = await request<API.Result<API.SclassCorrect>>(`/progress/getSclassCorrect/${sclassId}`);
  if (rs.obj) return { data: rs.obj };
  return null;
}
/**
 * 查询班级统计--tab2 覆盖率 学生列表 | 答对题数量、答过题数量、总题目数
 * @param sclassId
 * @returns
 */
export async function getSclassCoverage(sclassId: number, isFuzzyQuery: number, searchValue: string) {
  if (sclassId === -1) return;
  const rs = await request<API.Result<API.SclassCoverage[]>>(
    `/progress/getSclassCoverage/${sclassId}/${isFuzzyQuery}/${searchValue}`,
  );
  if (rs.obj) return { data: rs.obj };
  return null;
}
/**
 * 学生统计--tab1 正确率 习题列表 | 答对人数、答题人数、全班人数
 * @param sclassId
 * @returns
 */
export async function getStudentCorrect(sclassId: number, userId: number) {
  if (sclassId === -1) return;
  const rs = await request<API.Result<API.StudentCorrect>>(
    `/progress/getStudentCorrect/${sclassId}/${userId}`,
  );
  if (rs.obj) return { data: rs.obj };
  return null;
}
/**
 * 学生统计--tab2 覆盖率 当前学生 | 答对题数量、答过题数量、总题目数
 | 所有学生答对题目平均值(答对人题数/总学生) 
 | 所有学生答过题目平均值(做过人题数/总学生)
 * @param sclassId 
 * @returns 
 */
export async function getStudentCoverage(sclassId: number, userId: number) {
  if (sclassId === -1) return;
  const rs = await request<API.Result<API.StudentCoverage>>(
    `/progress/getStudentCoverage/${sclassId}/${userId}`,
  );
  if (rs.obj) return { data: rs.obj };
  return null;
}

/**
 * 学生课程--习题--知识点列表。查询知识点信息，包括习题数，以及学习进度
 * @param sclassId 班级id
 * @param courseId 课程id
 * @param count 6为页面需要显示的个数，如果传0为查询全部
 * @returns
 */
export async function getStuKnowledgeExerciseInfo(
  sclassId: number,
  courseId: number,
  count: number,
) {
  return request<API.Result<API.stuSclassKnowRecord[]>>(
    `/progress/getStuKnowledgeExerciseInfo/${sclassId}/${courseId}/${count}`,
  );
}

/**
 * 查询学生当前课程的进度
 * @param sclassId 班级id
 * @param courseId 课程id
 * @returns
 */
export async function getCourseProgressByStu(sclassId: number, courseId: number) {
  return request<API.Result<API.SclassRecord>>(
    `/progress/getCourseProgressByStu/${sclassId}/${courseId}`,
  );
}

export async function exportStatisticsInfo(sclassId: number, type: string, isFuzzyQuery: number, searchValue: string) {
  return request<API.Result<string>>(`/progress/exportStatisticsInfo/${sclassId}/${type}/${isFuzzyQuery}/${searchValue}`);
}
