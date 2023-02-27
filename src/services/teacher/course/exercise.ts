import { request } from 'umi';
import { API } from '@/common/entity/typings';


// 复制习题到我的课程
export function copyExerciseToMyCourse(params: { exerciseId: number, courseId: number }) {
    return request<API.Result<any>>(`/course/copyExerciseToMyCourse/${params.exerciseId}/${params.courseId}`);
}
// 新增/修改习题信息
export function updateExercise(params?: API.ExerciseListParams) {
    return request<API.Result<number>>('/course/updateExercise', { method: 'POST', data: params });
}

// 测试运行答案
export function testRunAnswer(params: { sceneId: number | undefined, answer: string | undefined }) {
    return request<API.Result<any>>('/course/testRunAnswer', { method: 'POST', data: params });
}

// 查询习题列表
export async function queryExerciseList(params?: API.ExerciseListParams) {
    const rs = await request<API.Result<API.PageHelper<API.ExerciseRecord>>>('/course/getExercise', { method: 'POST', data: { ...params, } });
    return {
        data: rs.obj.list,
        total: rs.obj.total,
    }
}
// 根据id查询习题
export async function getExerciseById(exerciseId: number) {
    return request<API.Result<API.ExerciseRecord>>(`/course/getExerciseById/${exerciseId}`);
};

// 删除习题
export async function removeExercise(exerciseId: number) {
    return request<API.Result<number>>(`/course/deleteExercise/${exerciseId}`);
};

/**
 * 批量删除习题
 * @param exerciseIds 
 * @returns 
 */
export async function batchRemoveExercise(exerciseIds: number[]) {
    return request<API.Result<number>>(`/course/batchDeleteExercise`, { method: 'POST', data: { exerciseIds } });
};
/**
 * 习题批量绑定场景
 * @param exerciseIds 
 * @returns 
 */
export async function batchBuildScene(sceneId: number, exerciseIds: number[]) {
    return request<API.Result<number>>(`/course/batchBuildScene/${sceneId}`, { method: 'POST', data: { exerciseIds } });
};

/**
 * 根据课程id，查询全部习题
 * @param courseId 
 * @returns 
 */
export async function getExerciseListByCourseId(courseId: number) {
    return request<API.Result<API.ExerciseRecord[]>>(`/course/getExerciseListByCourseId/${courseId}`);
};

/**
 * 根据课程id和班级id和知识点id
 * 查询习题的具体信息以及知识点信息和学生最新答题的答案
 * @param sclassId 
 * @param courseId 
 * @param knowId 
 * @returns 
 */
export async function getExerciseInfoList(sclassId: number, courseId: number, knowId: number) {
    return request<API.Result<API.StuAnswerExerciseInfo[]>>(`/course/getExerciseInfoList/${sclassId}/${courseId}/${knowId}`);
};

/**
 * 根据习题id，查询习题详情
 * @param sclassId 
 * @param courseId 
 * @param knowId 
 * @returns 
 */
export async function getExerciseInfo(sclassId: number, courseId: number, exerciseId: number) {
    return request<API.Result<API.StuAnswerExerciseInfo>>(`/course/getExerciseInfo/${sclassId}/${courseId}/${exerciseId}`);
};
// 查询习题列表


/**
 * 查询习题列表
 * @param params 
    参数：courseId：课程id，必传
    exerciseDesc：习题名称和描述
    sceneId：场景id，没有选择场景传-1，也可不传，后台默认-1
    knowledgeId：知识点id，没有选择知识点传-1，也可不传，后台默认-1* 
 * @returns 
 */
export async function getExerciseList(params: API.ExerciseParams) {
    return await request<API.Result<API.ExerciseRecord[]>>('/course/getExerciseList', { method: 'POST', data: { ...params, } });
}

export async function exportExerciseList(params: API.ExerciseParams) {
    return await request<API.Result<string>>('/course/exportExerciseList', { method: 'POST', data: { ...params, } });
}

export async function importExercise(params: { courseId: number; filePathList: string[] }) {
    return await request('/course/importExercise', { method: 'POST', data: { ...params } });
}

