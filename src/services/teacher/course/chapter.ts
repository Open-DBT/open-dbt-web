// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { API } from '@/common/entity/typings';
import { CHAPTER } from '@/common/entity/chapter'

/**
 * 目录树查询接口（带发布信息，根据班级id参数查询）
 * @param courseId 课程id
 * @param classId 班级id
 * @returns 
 */
export async function api_getCatalogueByClass(courseId: number, classId: number) {
  return request<API.Result<CHAPTER.CatalogueByClass>>(`/courseCatalogue/getCatalogueByClass/${courseId}/${classId}`);
}
/**
 * 目录-新增
 * @param courseId 课程id
 * @param parentId： 父级课程目录id
 * @param ，catalogueName：目录名称
 * @returns 
 */
export async function api_saveCatalogue(courseId: number, parentId: number, catalogueName: string) {
  const data = { courseId: courseId, parentId: parentId, catalogueName: catalogueName }
  return request<API.Result<CHAPTER.CourseCatalog>>(`/courseCatalogue/saveCatalogue`, { method: 'POST', data: data });
}
/**
 * 目录-删除
 * @param catalogueId 目录id
 * @returns 
 */
export async function api_delCatalogue(catalogueId: number) {
  return request<API.Result<CHAPTER.CourseCatalog[]>>(`/courseCatalogue/delCatalogue/${catalogueId}`);
}
/**
 * 目录-编辑接口
 * @param courseId 课程id
 * @param parentId： 父级课程目录id
 * @param ，catalogueName：目录名称
 * @returns 
 */
export async function api_updateCatalogue(data: CHAPTER.CourseCatalog) {
  return request<API.Result<CHAPTER.CourseCatalog>>(`/courseCatalogue/updateCatalogue`, { method: 'POST', data: data });
}
/**
 * 目录-上移
 * @param catalogueId 
 * @returns 
 */
export async function api_moveUp(catalogueId: number) {
  return request<API.Result<CHAPTER.CourseCatalog[]>>(`/courseCatalogue/moveSortNum/${catalogueId}/up`);
}
/**
 * 目录-下移
 * @param catalogueId 
 * @returns 
 */
export async function api_moveDown(catalogueId: number) {
  return request<API.Result<CHAPTER.CourseCatalog[]>>(`/courseCatalogue/moveSortNum/${catalogueId}/down`);
}

/**
 * 查询章节发布信息
 * @param courseId 
 * @returns 
 */
export async function api_getCatalogueAuth(courseId: number, chapterId: number) {
  return request<API.Result<CHAPTER.CourseCatalog>>(`/courseCatalogue/getCatalogueAuth/${courseId}/${chapterId}`);
}
/**
 * 发布保存
 * @param data 
 * @returns 
 */
export async function api_saveCatalogueAuth(data: CHAPTER.CourseCatalog) {
  return request<API.Result<CHAPTER.CourseCatalog>>(`/courseCatalogue/saveCatalogueAuthAll`, { method: 'POST', data: data });
}

/**
 * 章节统计概览
 * @param courseId 课程id
 * @param classId  班级id
 * @param chapterId 章节id
 * @returns 
 */
export async function api_getCatalogueProgress(courseId: number, chapterId: number, classId: number, serialNum: string) {
  return request<API.Result<CHAPTER.CourseChapterStat[]>>(`/statistics/getCatalogueProgress/${courseId}/${chapterId}/${classId}/${serialNum}`);
}

/**
 * 查询某个任务点，每个学生完成情况
 * @param courseId 
 * @param classId 
 * @param chapterId 
 * @returns 
 */
export async function api_getCatalogueInfo(data: any) {
  return request<API.Result<CHAPTER.ChapterTaskDetail[]>>(`/statistics/getCatalogueInfo`, { method: 'POST', data: data });
}
/**
 * 查询章节统计详情页的章节标题和资源标题
 * @param courseId 
 * @param catalogueId 
 * @param classId 
 * @param resourcesId 
 * @returns 
 */
export async function api_getCatalogueInfoTitle(courseId: number, catalogueId: number, classId: number, resourcesId: number) {
  const data = { courseId: courseId, catalogueId: catalogueId, classId: classId, resourcesId: resourcesId }
  return request<API.Result<CHAPTER.ChapterTaskDetailTitle>>(`/statistics/getCatalogueInfoTitle`, { method: 'POST', data: data });
}

/**
 * 章节统计学生概览
 * @param courseId 
 * @param classId 
 * @param chapterId 
 * @returns 
 */
export async function api_getStudentProgress(data: any) {
  return request<API.Result<CHAPTER.ChapterStatStudent>>(`/statistics/getStudentProgress`, { method: 'POST', data: data });
}
/**
 * 查询章节统计-学生统计，查询该学生对本任务点的纵向数据
 * 同教师端统计1个接口，所以有2个固定值
 * @param courseId 
 * @param chapterId 学生端默认-1
 * @param classId 
 * @param userId 
 * @param serialNum 学生端默认1
 * @returns 
 */
export async function api_getStudentInfo(courseId: number, chapterId: number, classId: number, userId: number, serialNum: string) {
  return request<API.Result<CHAPTER.CourseChapterStatStudentProcess>>
    (`/statistics/getStudentInfo/${courseId}/${chapterId}/${classId}/${userId}/${serialNum}`);
}
/**
 * 查询学生，对这个章节任务点完成情况
 * @param courseId 
 * @param chapterId 
 * @param classId 
 * @param userId 
 * @returns 
 */
export async function api_getCatalogueStatisticsInfo(courseId: number, chapterId: number, classId: number, userId: number) {
  return request<API.Result<{ completeNum: number, totalNum: number }>>(`/statistics/getCatalogueStatisticsInfo/${courseId}/${chapterId}/${classId}/${userId}`);
}
