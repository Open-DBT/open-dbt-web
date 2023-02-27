import { request } from 'umi';
import { API } from '@/common/entity/typings';
import { QUESTION_BANK } from '@/common/entity/questionbank'
/**
 * 题库-习题保存接口
 * @param courseId 课程id
 * @param parent_id： 父级课程目录id
 * @param ，catalogue_name：目录名称
 * @returns 
 */
 export async function saveExercise(data: QUESTION_BANK.QuestionExercise) {
    return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/exercise/saveExercise`, { method: 'POST', data: data });
}

/**
 * 题库-习题详情查询接口
 * @param exercise_id 习题id
 * @returns 
 */
 export async function getExerciseInfo(exercise_id: number) {
  return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/exercise/getExerciseInfo/${exercise_id}`);
}