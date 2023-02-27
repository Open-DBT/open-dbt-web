import { request } from 'umi';
import { API } from '@/common/entity/typings';
import { TASK } from '@/common/entity/task';
import { QUESTION_BANK } from '@/common/entity/questionbank';

export async function api_getHomeWork(data: TASK.TaskListParam) {
    return await request('/homeWork/getHomeWork', { method: 'POST', data });
}
/**
 * 选题完成接口
 * @param data 
 * @returns 
 */
export async function completedSelectedExercises(data: TASK.TaskSelectFinshParam) {
    return await request('/homeWorkModel/completedSelectedExercises', { method: 'POST', data });
}
/**
 * 模板习题左侧列表显示
 * @param id 作业模板id
 * @param flag 0:左侧列表 1：详情列表
 * @returns 
 */
export async function getExercisesByModelId(id: number, flag: number) {
    return await request(`/homeWorkModel/getExercisesByModelId/${id}/${flag}`);
}
/**
 * 删除选题接口
 * @param modelId 模板id
 * @param exerciseId 习题id
 * @returns 
 */
export async function delSelectedExercises(modelId: number, exerciseId: number) {
    return await request(`/homeWorkModel/delSelectedExercises/${modelId}/${exerciseId}`);
}
/**
 * 作业库列表查询
 * @returns 
 */
export async function getHomeWorkModelExercises(data: any) {
    const rs = await request<API.Result<QUESTION_BANK.ExerciseRecord>>('/homeWorkModel/getHomeWorkModelExercises', { method: 'POST', data: data });
    if (rs.success)
        return {
            count: rs.obj.exerciseCount,
            list: rs.obj.pageList.list,
            modelExerciseDTOS: rs.obj.modelExerciseDTOS,
            pagination: { current: rs.obj.pageList.pageNum, pageSize: rs.obj.pageList.pageSize, total: rs.obj.pageList.total },
        }
    else {
        return {
            count: 0,
            list: [],
            pagination: { current: 1, total: 0, pageSize: 10 },
        }
    }
}
/**
 * 作业-习题保存接口
 * @param courseId 课程id
 * @param parentId： 父级课程目录id
 * @param ，catalogueName：目录名称
 * @returns 
 */
export async function saveExerciseInfoByModel(data: QUESTION_BANK.QuestionExercise) {
    return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/homeWorkModel/saveExerciseInfoByModel`, { method: 'POST', data: data });
}
/**
 * 作业-习题详情查询接口
 * @param exerciseId 习题id
 * @param modelId 模板id
 * @returns 
 */
export async function getExerciseInfoByModel(exerciseId: number, modelId: number) {
    return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/homeWorkModel/getExerciseInfoByModel/${exerciseId}/${modelId}`);
}
/**
* 查询作业模板列表
* @param courseId 
* @param clazzId 
* @returns 
*/
export async function getHomeWorkModel(data: any) {
    const rs = await request<API.Result<any>>('/homeWorkModel/getHomeWorkModel', { method: 'POST', data: data });
    if (rs.success)
        return {
            count: rs.obj.count,
            list: rs.obj.objectPageInfo.list,
            pagination: { current: rs.obj.objectPageInfo.pageNum, pageSize: rs.obj.objectPageInfo.pageSize, total: rs.obj.objectPageInfo.total },
        }
    else {
        return {
            count: 0,
            list: [],
            pagination: { current: 1, total: 0, pageSize: 10 },
        }
    }
}
// 文件夹保存
export function saveHomeWorkModelFolder(data: { courseId: number, parentId: number | undefined, authType: number, modelName: string, id: string | number }) {
    return request<API.Result<boolean>>(`/homeWorkModel/saveHomeWorkModelFolder`, { method: 'POST', data: data });
}

// 文件夹目录
export function getHomeWorkModelCatalogueTree(courseId: number) {
    return request<API.Result<QUESTION_BANK.QuestionExercise[]>>(`/homeWorkModel/getHomeWorkModelCatalogueTree/${courseId}`);
}
/**
* 作业库作业位置调整
* @param id  原始id
* @param tid 目标id
* @returns 
*/
export async function moveHomeWorkModel(oid: number, tid: number) {
    return await request<API.Result<boolean>>(`/homeWorkModel/moveHomeWorkModel/${oid}/${tid}`, { method: 'GET' });
}
// 复制题目
export function copyHomeWorkModel(id: number) {
    return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/homeWorkModel/copyHomeWorkModel/${id}`);
}
// 删除习题
export function delHomeWorkModel(id: number) {
    return request<API.Result<boolean>>(`/homeWorkModel/delHomeWorkModel/${id}`);
}
// 发布设置查询
export function getHomeWorkSet(id: number) {
    return request<API.Result<TASK.TaskList>>(`/homeWork/getHomeWorkSet/${id}`);
}
/**
 * 作业库-发布接口
 * @returns 
 */
 export async function publishHomeWork(data: TASK.PublishDataParam) {
    return request<API.Result<boolean>>(`/homeWorkModel/publishHomeWork`, { method: 'POST', data: data });
}
/**
 * 作业库-发布保存A接口
 * @returns 
 */
 export async function saveHomeWorkSet(data: TASK.PublishDataParam) {
    return request<API.Result<boolean>>(`/homeWork/saveHomeWorkSet`, { method: 'POST', data: data });
}
/**
 * 班级列表查询（根据当前登录人和课程id查询未结束的班级列表）
 * @returns 
 */
 export async function getClassByLoginUser(courseId: number) {
    return request<API.Result<any>>(`/courseCatalogue/getClassByLoginUser/${courseId}`);
}
/**
 * 根据班级id获取学生列表
 * @returns 
 */
 export async function getSclassStudentList(data: {sclassId : number}) {
    return request<API.Result<any>>(`/courseCatalogue/getSclassStudentList`, { method: 'POST', data: data });
}
/**
 * 作业列表查询
 * @returns 
 */
 export async function getHomeWork(data: any) {
    const rs = await request<API.Result<QUESTION_BANK.ExerciseRecord>>('/homeWork/getHomeWork', { method: 'POST', data: data });
    if (rs.success)
        return {
            count: rs.obj.exerciseCount,
            list: rs.obj.pageList.list,
            pagination: { current: rs.obj.pageList.pageNum, pageSize: rs.obj.pageList.pageSize, total: rs.obj.pageList.total },
        }
    else {
        return {
            count: 0,
            list: [],
            pagination: { current: 1, total: 0, pageSize: 10 },
        }
    }
}
/**
 * 新建作业模板--新建页面右上角保存执行该接口，同时保存模板和模板内习题
 * @returns 
 */
 export async function saveHomeWorkModel(data: any) {
    return request<API.Result<any>>(`/homeWorkModel/saveHomeWorkModel`, { method: 'POST', data: data });
}
export async function publishList(courseId: number) {
    return await request<API.Result<TASK.TASKPublishListTree>>(`/homeWorkModel/publishList/${courseId}`);
}
// 作业列表-删除作业 
export function delHomeWork(id: number) {
    return request<API.Result<boolean>>(`/homeWork/delHomeWork/${id}`);
}
// 批阅列表-批阅列表查询
export function getApprovalList(data: TASK.TaskReviewListParam) {
    return request<API.Result<API.PageHelper<TASK.TaskReviewListData>>>(`/homeWork/getApprovalList`, { method: 'POST', data: data });
}
// 批阅列表-提交
export function approval(data: TASK.TaskReviewParam) {
    return request<API.Result<boolean>>(`/homeWork/approval`,  { method: 'POST', data: data });
}
// 批阅列表-打回重做
export function taskCallBack(homeworkId: number, studentId: number) {
    return request<API.Result<boolean>>(`/homeWork/callBack/${homeworkId}/${studentId}`);
}
// 批阅列表-加时
export function overTime(data: TASK.TaskReviewOverTimeParam) {
    return request<API.Result<boolean>>(`/homeWork/overTime`, { method: 'POST', data: data });
}
// 批阅列表-统计
export function getApprovalCount(data: TASK.TaskReviewCountParam) {
    return request<API.Result<TASK.TaskReviewCount>>(`/homeWork/getApprovalCount`, { method: 'POST', data: data });
}