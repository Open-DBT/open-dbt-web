import { request } from 'umi';
import { API } from '@/common/entity/typings';

/**
 * 查询场景列表
 * @param {*} params 
 * @returns 
 */
export async function queryScene(params?: API.SceneParams) {
    console.log('queryScene params ==', params);
    const rs = await request<API.Result<API.PageHelper<API.SceneListRecord>>>('/course/getScene', { method: 'POST', data: params });
    return {
        data: rs.obj.list,
        total: rs.obj.total,
        status: rs.success,
        message: rs.message,
    }
};

/**
 * 查询场景列表不分页
 * @param {*} params 
 * @returns 
 */
export async function getShareScene(courseId?: number) {
    return await request<API.Result<API.SceneListRecord[]>>(`/course/getShareScene/${courseId}`);
};

/**
 * 删除场景
 * @param {*} sceneId 
 * @returns 
 */
export async function removeScene(sceneId?: number) {
    return request<API.Result<number>>(`/course/deleteScene/${sceneId}`);
};

/**
 * 复制场景
 * @param {*} sceneId 
 * @returns 
 */
export async function copyScene(sceneId?: number) {
    return request<API.Result<number>>(`/course/copyScene/${sceneId}`);
};

/**
 * 保存场景
 * @param {*} params 
 * @returns 
 */
export async function saveScene(params?: API.SceneListRecord) {
    return request<API.Result<number>>('/course/updateScene', { method: 'POST', data: params });
};

/**
 * 根据id获取场景信息
 * @param {*} sceneId 
 * @returns 
 */
export async function getSceneInfo(sceneId: number) {
    return request<API.Result<API.SceneListRecord>>(`/course/getSceneDetail/${sceneId}`);
};

/**
 * 测试场景sql脚本
 * @param {*} params 
 * @returns 
 */
export async function testSceneSQLShell(params?: API.SceneParams) {
    return request<API.Result<number>>('/course/testSceneSQLShell', { method: 'POST', data: params });
};

/**
 * 复制场景到我的课程
 * @param {*} sceneId 
 * @param {*} courseId
 * @returns 
 */
export async function copySceneToMyCourse(params: { sceneId: number, courseId: number }) {
    return request<API.Result<number>>(`/course/copySceneToMyCourse/${params.sceneId}/${params.courseId}`);
};

/**
 * 根据课程id，导出全部场景
 * @param courseId 
 * @returns 
 */
export async function exportSceneList(courseId: number) {
    return await request<API.Result<string>>(`/course/exportSceneList/${courseId}`);
};
/**
 * 根据场景id，导出场景
 * @param sceneId 
 * @returns 
 */
export async function exportSceneById(sceneId: number) {
    return await request<API.Result<string>>(`/course/exportSceneById/${sceneId}`);
};
export async function importScene(params: { courseId: number; filePathList: string[] }) {
    return await request<API.Result<string>>('/course/importScene', { method: 'POST', data: { ...params } });
};