// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { API } from '@/common/entity/typings';
import { CHAPTER } from '@/common/entity/chapter';
/**
 * 学生端目录树查询接口
 * @param courseId 课程id
 * @returns 
 */
 export async function getCatalogueByStu(courseId: number) {
    return request<API.Result<CHAPTER.ChapterStudent>>(`/courseCatalogue/getCatalogueByStu/${courseId}`);
}
/**
 * 学生学习进度保存接口
 * @param data 视频任务点源对象
 * @returns 
 */
 export async function saveProgressByStudent(data:CHAPTER.ChapterStudentTaskProcessParm) {
    return request<API.Result<CHAPTER.ChapterTaskDetail>>(`/contents/saveProgressByStudent`, { method: 'POST', data: data });
}
/**
 * 学生端内容查询接口
 * @param data 资源对象
 * @returns 
 */
 export async function findRichTXTByStudent(courseId:number, catalogueId: number) {
    return request<API.Result<any>>(`/contents/findRichTXTByStudent/${courseId}/${catalogueId}`);
}