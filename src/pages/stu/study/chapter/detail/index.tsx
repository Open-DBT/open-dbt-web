import Menu from './menu';
import Content from './content';
import './index.less';
import { useEffect, useState } from 'react';
import { sortList } from '@/pages/common-course/chapter/utils/utils'
import { getCatalogueByStu } from '@/services/student/course/chapter';
import { history, useModel } from 'umi';
import { api_getCatalogueStatisticsInfo } from '@/services/teacher/course/chapter';
import { CHAPTER } from '@/common/entity/chapter'

/**
 * 课程-章节预览
 * @param props 
 * @returns 
 */
const ChapterDealIndex = (props: any) => {
  const courseId = props.match.params.courseId;
  const chapterId = props.match.params.chapterId;
  const clazzId = props.match.params.clazzId;
  const [isLevelFirst, setIsLevelFirst] = useState<boolean>(false);//是否是一级菜单
  const [listData, setListData] = useState<CHAPTER.CourseCatalog[]>([]);//章节目录列表
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const recycledChapter = (id: number, data: CHAPTER.CourseCatalog[]) =>
    data.forEach((item, index) => {
      if (item.id === id) {
        item.catalogueScale = 100;
      } else {
        if (item.childrens) {
          recycledChapter(id, item.childrens);
        }
      }
    });

  const updateStudyState = (chapterId: number) => {
    //验证当前章节是否已经看完
    currentUser && currentUser.userId &&
      api_getCatalogueStatisticsInfo(courseId, chapterId, clazzId, currentUser.userId).then((res) => {
        if (res.success && res.obj.completeNum > 0 && (res.obj.completeNum == res.obj.totalNum)) {
          recycledChapter(chapterId, listData)
          setListData([...listData])
        }
      })
  }
  useEffect(() => {
    //查询章节列表
    getCatalogueByStu(courseId).then((res) => {
      res.success &&
        setListData(sortList(res.obj.catalogueTreeList) as CHAPTER.CourseCatalog[])
    })
  }, []);

  //这里需要做个判断，如果参数有问题，做一个跳转
  return (
    <div style={{ height: 'calc(100vh - 56px)' }}>
      <Menu
        courseId={courseId}
        chapterId={chapterId}
        clazzId={clazzId}
        setIsLevelFirst={(flag: boolean) => setIsLevelFirst(flag)}
        chapterList={listData}
      />
      {
        isLevelFirst ?
          <div />
          : <Content courseId={courseId} chapterId={chapterId} updateStudyState={updateStudyState} />
      }
    </div>
  )
}

export default ChapterDealIndex