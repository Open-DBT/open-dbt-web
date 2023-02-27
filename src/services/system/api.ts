import { request } from 'umi';
import { API } from '@/common/entity/typings';

// 获取当前登录的用户
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.Result<API.CurrentUser>>('/getCurrentUser', { method: 'GET', ...(options || {}) });
}
// 登录接口
export async function login(params: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/login', { method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: params,
    ...(options || {}),
  });
}

// 获取所有通知
export async function getNotices() {
  return request<API.Result<API.NoticesListTO>>('/getNotices');
}

// 获取未读通知
export async function getNoticesNotRead() {
  return request<API.Result<API.NoticesListTO>>('/getNoticesNotRead');
}

// 添加已读通知
export async function changeRead(type?: number, noticeId?: number) {
  console.log('changeRead type==', type, ", noticeId==", noticeId);
  return request<API.Result<number>>(`/changeRead/${type}/${noticeId}`);
};

// 清空未读通知
export async function clearNotRead(type?: number) {
  console.log('clearNotRead type==', type);
  return request<API.Result<number>>(`/clearNotRead/${type}`);
};

// 获取菜单导航栏
export async function getMenu() {
  return request('/getMenu', {method: 'GET'});
}


/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
