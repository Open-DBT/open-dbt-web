import { CHAPTER } from '@/common/entity/chapter'

/**
 * 将第一层的递归集合遍历成纵向列表，并且添加序号
 * @param list: 课程章节第1层的children
 * @param list: catalogueTreeList对象
 * @returns 
 */
 export const sortList = (list: CHAPTER.CourseCatalog[] | CHAPTER.CourseChapterStat[]): CHAPTER.CourseCatalog[] | CHAPTER.CourseChapterStat[] => {
  if (!list) return [];
  list.map((res, index) => {
    if (res.childrens && res.childrens.length) {
      /**
       * 树形菜单的递归节点，整理成1个1级菜单，剩下全部是2级菜单
       * 例：
       * 第2章 children - [2.1,2.2,2.2.1,2.2.2,2.3]        
       */
      const flattenList = flatten(res.childrens);
      /**
       * 给节点添加sort序号
       */
      res.childrens = flattenList;

    }
  })
  return list;
}

/**
 * 遍历递归数组成为列表
 * @param data 
 * @returns 
 */
 const flatten = (data: CHAPTER.CourseCatalog[] | CHAPTER.CourseChapterStat[]): CHAPTER.CourseCatalog[] | CHAPTER.CourseChapterStat[] => {
  const arr = [] as any
  return arr.concat(...data.map((item, i) => {
    if (item.childrens && item.childrens.length) {
      const temp = [item] as any;
      item.childrens.map(item => temp.push(item));
      item.childrens = [];
      return flatten(temp)
    }
    return arr.concat(item)
  }));
}

/**
 * 给sortName赋值
 * @param data 
 * @param headerIndex 
 * @returns 
 */
const addSortName = (data: CHAPTER.CourseCatalog[], headerIndex: number) => {
  let level = 2;
  let curr = `${headerIndex}.0`;//2.1
  //从level=2开始
  data.forEach((element, index) => {
    if (element.catalogue_level > level) {
      //从2.2 添加一层为2.2.1
      curr = curr + '.1';
    } else if (element.catalogue_level < level) {
      //比较深的子节点，说明进入下一层目录
      const arr = curr.split('.');
      arr[element.catalogue_level - 1] = (Number(arr[element.catalogue_level - 1]) + 1) + '';
      /**
       * splice使用方法，var a = [1,2,3], a.splice(0,1)=> [1]
       * 所以起点是0，截取位置
       */
      const str = arr.splice(0, element.catalogue_level);
      curr = str.join('.');
    } else {
      //当前level，数字+1
      const arr = curr.split('.');
      arr[element.catalogue_level - 1] = (Number(arr[element.catalogue_level - 1]) + 1) + '';
      curr = arr.join('.');
    }
    level = element.catalogue_level;
    element.sortName = curr;
  })
  return data;
}