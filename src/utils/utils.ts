/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

import { Node } from "@antv/x6";
const color = ['#ff4d4f', '#1890ff', '#52c41a']//红色 蓝色 绿色
export const setColor = (val: number, locale: string, item: Node): void => {
  //进度颜色设置
  if (val == 100)
    item.attr(locale, color[2]);
  else if (val > 0)
    item.attr(locale, color[1]);
  else item.attr(locale, color[0]);
}

export const isNotEmptyBraft = (val: string | undefined): boolean => {
  if (val && val != null && val != '<p></p>') return true
  return false
}

export const getKnowledgeColor = (): string[] => {
  const color = ['#00CE9B', '#FF6B6B', '#7DD8CD', '##7DD8CD', 'FDDF66', '#f50'];
  return color;
}

export const getEnglishMonth = (): string[] => {
  // 英语月份缩写为：一月Jan、二月Feb、三月Mar、四月Apr、五月May、六月Jun、七月Jul、八月Aug、九月Sept、十月Oct、十一月Nov、十二月Dec。
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
}
export const getChinaMonth = (): string[] => {
  return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
}

export const getZoom = (nodes: Node[]): number => {

  nodes.map((node, index) => {
  })
  if (nodes.length >= 40) {
    return -0.6
  } else if (nodes.length > 23) {
    return -0.4
  } else if (nodes.length > 18) {
    return -0.3
  } else if (nodes.length > 15) {
    return -0.2
  } else {
    return -0.1
  }
}
import { history } from 'umi';

/**
 * 验证正整数
 * @param param 
 */
export const ValidateIntegerParam = async (param: any) => {
  try {
    var reg = /^[1-9]\d*$/g;
    if (!reg.test(param)) {
      setTimeout(() => {
        history.push('/home')
      }, 1000);
      return false;
    }
    return true;
  } catch (error) { return false }
}
/**
 * 题目目录滚动事件
 * 滚动到指定锚点 
 */
export const scrollToAnchor = (anchorName: string) => {
  if (anchorName) {
    let anchorElement = document.getElementById(anchorName);
    if (anchorElement) {
      anchorElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}