import { request } from 'umi';
import { API } from '@/common/entity/typings';

/**
 * 查询自己最近课程
 *  0是查询类型，0为查询自己的课程，1为查询公开的课程既课程模板
 *  3是需要查询个数，0为查询全部
 * @returns 
 */
export async function getLastCourseList() {
    return await request<API.Result<API.CourseListItem[]>>('/course/getCourseList/0/3', { method: 'POST' });
}
// 查询自己创建的课程
export async function getMyCourseList() {
    return await request<API.Result<API.CourseListItem[]>>('/course/getCourseList/0/0', { method: 'POST' });
}
// 查询其他人的课程模板
export async function getCourseTemplate() {
    return await request<API.Result<API.CourseListItem[]>>('/course/getOtherPublishCourse', { method: 'POST' });
}
// 查询全部的课程模板
export async function getALLCourseTemplate() {
    return await request<API.Result<API.CourseListItem[]>>('/course/getCourseList/1/0', { method: 'POST' });
}
// 查询自己的课程列表
export async function queryOwnCourse(params: API.PageParams) {
    const rs = await request<API.Result<API.PageHelper<API.CourseListItem>>>('/course/getOwnCourse', { method: 'POST', data: { ...params } });
    return {
        data: rs.obj.list,
        total: rs.obj.total,
    }
}

// 查询所有人发布的课程
export async function queryCoursePublish(params: API.CourseDetailRecord) {
    const rs = await request<API.Result<API.PageHelper<API.CourseListItem>>>('/course/getCoursePublish', { method: 'POST', data: { ...params, } });
    return {
        data: rs.obj.list,
        total: rs.obj.total,
    }
}

// 删除课程
export async function removeCourse(courseId: number) {
    return request<API.Result<number>>(`/course/deleteCourse/${courseId}`);
}

// 设置课程是否公开
export async function updateIsOpen(params: { courseId: number, isOpen: number }) {
    const rs = await request<API.Result<number>>('/course/updateIsOpen', { method: 'POST', data: { ...params, } });
    return {
        status: rs.success,
        message: rs.message
    }
}

// 复制课程
export async function copyCourse(courseId: number) {
    return request<API.Result<number>>(`/course/copyCourse/${courseId}`);
}

// 新增/修改课程
export async function updateCourse(params: API.CourseDetailRecord) {
    return request<API.Result<API.CourseDetailRecord>>('/course/updateCourse', { method: 'POST', data: { ...params } });
}

//根据id查询课程简介
export async function getCourseDetail(courseId: number) {
    return request<API.Result<API.CourseListItem>>(`/course/getCourseDetail/${courseId}`);
}
//查询课程封面集合
export async function getCourseCoverImageList() {
    return request<API.Result<string[]>>(`/course/getCourseCoverImageList`);
}

// 根据id查询课程知识点
export async function getKnowledge(courseId: number) {
    return request<API.Result<string>>(`/course/getKnowledge/${courseId}`);
}

// 根据课程id，保存知识点
export async function updateKnowledge(params: any) {
    return request<API.Result<string>>('/course/updateKnowledge', { method: 'POST', data: { ...params } });
}

//根据习题id查询课程知识点(不是树结构)
export async function getKnowledgeNotTree(courseId: number) {
    return request<API.Result<API.KnowledgeListRecord[]>>(`/course/getKnowledgeNotTree/${courseId}`);
}
