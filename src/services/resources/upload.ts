import { request } from 'umi';
import { API } from '@/common/entity/typings';
import { CHAPTER } from '@/common/entity/chapter';

export async function uploadResources() {
  return request<API.Result<any>>(`/resources/uploadResources`);
};
/**
 * 目录id-资源读取
 * @param id 资源id
 * @returns 
 */
export async function uploadResourceSelect(id: number) {
  return request<API.Result<any>>(`/resources/readResourse/${id}/transfer`, { method: 'GET', responseType: 'blob' });
}
/**
 * 富文本内容保存接口
 * @param data 内容对象
 * @returns 
 */
export async function api_saveRichTXT(data: object) {
  return request<API.Result<any>>(`/contents/saveRichTXT`, { method: 'POST', data: data });
}
/**
 * 章节内容查询接口
 * @param courseId 课程id
 * @param catalogueId 目录id
 * @returns 
 */
export async function findRichTXT(courseId: number, catalogueId: number) {
  return request<API.Result<any>>(`/contents/findRichTXT/${courseId}/${catalogueId}`);
}
/**
 * 目录资源表查询接口
 * @param id 资源目录表id
 * @returns 
 */
export async function findCatalogueResources(id: number) {
  return request<API.Result<any>>(`/contents/findCatalogueResources/${id}`);
}
/**
 * 雪花算法生成目录资源表id接口
 * @returns 
 */
export async function getCatalogueResourcesId() {
  return request<API.Result<any>>(`/contents/getCatalogueResourcesId`);
}

/**
 * 资源列表树接口
 * @param data 查询参数对象
 * @returns 
 */
export async function listResourcesTree(data: object) {
  return request<API.Result<CHAPTER.HistoryResource[]>>(`/resources/listResourcesTree`, { method: 'POST', data: data });
}