import { request } from 'umi';
import { API } from '@/common/entity/typings';

/**
 * 测试运行答案
 * @param {*} params 
 * @returns 
 */
export async function stuTestRunAnswer(params: { answer: string, usageTime: number, exerciseId: number }) {
    console.log('stuTestRunAnswer params ==', params)
    return await request('/score/stuTestRunAnswer', { method: 'POST', data: { ...params } });
}

/**
 * 答题提交答案
 * @param {*} params 
 * @returns 
 */
export async function submitAnswer(params: { answer: string, usageTime: number, exerciseId: number,sclassId:number }) {
    console.log('submitAnswer params ==', params)
    return await request('/score/submitAnswer', {
        method: 'POST', data: { ...params, },
    });
}

/**
 * 查询学生习题列表
 * @param {*} params 
 * @returns 
 */
export async function getStuExercise(params?: API.ExerciseListParams) {
    console.log('getStuExercise params ==', params)
    const rs = await request<API.Result<API.PageHelper<API.StuExerciseListRecord>>>('/score/getStuExercise', { method: 'POST', data: { ...params, } });
    return {
        data: rs.obj.list,
        total: rs.obj.total,
    }
}

/**
 * 根据 班级id/课程id/知识点id 查询习题列表信息
 * @param {*} params 
 * @returns 
 */
 export async function getExerciseInfoByStu(sclassId:number,courseId:number,knowId: number) {
    return await request<API.Result<API.stuExerciseInfo>>(`/score/getExerciseInfoByStu/${sclassId}/${courseId}/${knowId}`);
}
