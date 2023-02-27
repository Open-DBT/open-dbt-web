import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import { currentUser as queryCurrentUser, getMenu } from './services/system/api';
import { RequestInterceptor, ResponseInterceptor } from './../node_modules/umi-request';
import { createRef } from 'react';
import { API } from '@/common/entity/typings';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const currentUser = await queryCurrentUser();
      return currentUser.obj;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
};

const requestInterceptors: RequestInterceptor = (url: string, options: RequestInit) => {
  let access_token = localStorage.getItem("access_token");
  if (access_token) {
    options.headers = {
      ...options.headers,
      "Authorization": `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    }
  }
  return { url, options };
}

const responseInterceptors: ResponseInterceptor = (async (response: any, options: RequestInit) => {
  const { url, status } = response;
  // 返回下载流的问题,可以在url添加标识
  if (url.indexOf('/readResourse/') !== -1) {
    if (status !== 200) {
      notification.error({
        message: `视频出错 : ${url}`,
      });
    } else {
      return await response.blob();
    }
    return null;
  }
  const data = await response.clone().json();
  if (data.code === 401) {
    history.push(loginPath);
    localStorage.setItem("access_token", '');
  }
  if (data.token) {
    localStorage.setItem("access_token", data.token);
  }
  return response;
});

/**
 * 异常处理程序
 const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    405: '请求方法不被允许。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
 };

 * @see https://beta-pro.ant.design/docs/request-cn
 */
let prefix = 'http://xxx.xxx.xx.xxx:xxxxx/open-dbt';
//开发模式
if (isDev) prefix = 'http://xxx.xxx.xx.xxx:xxxxx/open-dbt'
export const request: RequestConfig = {
  credentials: 'include',
  prefix: prefix,
  requestInterceptors: [requestInterceptors],
  responseInterceptors: [responseInterceptors],

  //自定义端口规范,避免errorInfo.success==false进入errorHandler
  errorConfig: {
    adaptor: (res: any) => {
      return {
        // code为200，请求成功；code为401，token验证失败或token失效过期，不需要进入errorHandler，只需要跳转到登录页
        success: res.code == 200 || res.code == 401 || res instanceof Blob
      };
    },
  },
  errorHandler: (error: any) => {
    const { response } = error;
    if (response && response.status) {
      const { status, url } = response;
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: '请求失败',
      });
    }

    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
    throw error;
  },
};

import logo from '@/img/logo-itol.png'
export const layoutActionRef = createRef<{ reload: () => void }>();

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
// console.log('initialState ', initialState?.currentUser?.userId,initialState)  
  return {
    actionRef: layoutActionRef,
    disableContentMargin: false,
    //水印
    waterMarkProps: false,
    //menu 菜单的头部点击事件
    onMenuHeaderClick: undefined,
    onPageChange: () => {//页面切换时触发
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
      //由于menu的params存在bug，等官方修复再更新，先临时用重复刷新替代，这样的缺点是请求2次menu
      // layoutActionRef.current.reload();
    },
    footerRender: () => false, //底部页面
    rightContentRender: () => <RightContent />,//右上角页面
    //渲染 logo 和 title
    menuHeaderRender: () => (
      <img src={logo} style={{ height: 42 }}></img>
    ),
    menu: {
      // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
      // params: {
      //   userId: initialState
      // },
      params: initialState,
      request: async (params, defaultMenuData) => {
        // initialState.currentUser 中包含了所有用户信息
        if (initialState?.currentUser) {
          const menuData = await getMenu();
          if (menuData.obj) {
            return menuData.obj
          }
        }
        return;
      },
      locale: false //禁用国际化
    },
    contentStyle: { margin: 0 },
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    //   if (initialState.loading) return <PageLoading />;
    //   return children;
    // },    
    ...initialState?.settings,
    // headerRender: <a>Ant design</a>,
  };


};
