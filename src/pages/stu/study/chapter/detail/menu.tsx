
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { UpOutlined } from '@ant-design/icons';
import { getCatalogueByStu } from '@/services/student/course/chapter';
import { DownOutlined } from '@ant-design/icons';
import { getCourseDetail } from '@/services/teacher/course/course';
import { sortList } from '@/pages/common-course/chapter/utils/utils'
import { API } from '@/common/entity/typings';
import {
  CheckOutlined
} from '@ant-design/icons';
import { history } from 'umi';
import { CHAPTER } from '@/common/entity/chapter'

interface IProps {
  courseId: number;
  clazzId: number;
  chapterId: number;
  setIsLevelFirst: (flag: boolean) => void;
  chapterList: CHAPTER.CourseCatalog[];
}

/**
 * 章节预览，左侧目录
 * @param props 
 * @returns 
 */
const menuTree = (props: IProps) => {
  const { courseId, clazzId, chapterId, chapterList } = props;
  const [showButton, setShowButton] = useState<boolean>(false);// 编辑按钮显示控制变量
  const [showIndex, setShowIndex] = useState<number>(chapterId); // 选中对象对应id
  const [checkPanel, setCheckPanel] = useState<number[]>([]);//哪些panel节点需要展开
  const [course, setCourse] = useState<API.CourseListItem>();//课程对象
  const {
    setIsLevelFirst: setIsLevelFirst
  } = props;

  /**
   * init
   */
  useEffect(() => {
    getCourseDetail(courseId).then((result) => {
      result.success && setCourse(result.obj)
    })
  }, []);

  /**
   * 树形菜单的变化
   */
  useEffect(() => {
    console.log('useEffect[chapterList]', chapterList)
    //处理章节列表
    selectNode(showIndex, chapterList)
    //保存展开的id
    const expandIds = chapterList.map((item) => {
      return item.id;
    })
    setCheckPanel(expandIds);
  }, [chapterList]);

  /**
   * 切换章节id
   */
  useEffect(() => {
    selectNode(chapterId, chapterList)
  }, [chapterId]);

  /**
   * 设置默认值
   * @param item 
   * @returns 
   */
  const setDefaultFun = (item: any) => {
    setShowButton(true);
    setShowIndex(item.id);
  }
  /**
   * 选中行
   * @param item 
   * @returns 
   */
  const handleOnClickRow = (item: CHAPTER.CourseCatalog) => {
    setDefaultFun(item);
    history.replace(`/stu/course/chapter/detail/${courseId}/${clazzId}/${item.id}`)
  }
  /**
   * 遍历数组，找到id对应的节点，选中节点对应赋值
   * @param id 
   * @param data 
   * @returns 
   */
  const selectNode = (id: number, data: CHAPTER.CourseCatalog[]) => {
    data.forEach((item) => {
      if (item.id == id) {
        //是否一级目录，内容显示区域
        if (item.catalogueLevel == 1) setIsLevelFirst(true)
        else setIsLevelFirst(false)
        setDefaultFun(item)
        return
      }
      //递归查找到当前节点
      if (item.childrens) selectNode(id, item.childrens);
    })
  };

  /**
   * 收起面板，从数组中剔除
   * @param id 
   */
  const switchNodeWrap = (id: number) => {
    const index = checkPanel.findIndex((item) => item == id);
    if (index > -1) {
      const list = [...new Set(checkPanel)]//去重
      list.splice(index, 1);
      setCheckPanel(list)
    }
    console.log('switchNodeWrap checkPanel', checkPanel)
  }
  /**
   * 展开面板,从数组中追加
   * @param id 
   */
  const switchNodeExpand = (id: number) => {
    const index = checkPanel.findIndex((item) => item == id);
    if (index == -1) {
      const list = [...new Set(checkPanel)]//去重
      list.push(id);
      setCheckPanel([...list])
    }
    console.log('switchNodeExpand checkPanel', checkPanel)
  }

  return (
    <>
      <div className="chapter-edit-menu" style={{ position: 'fixed', top: 56 }}>
        {/* 头部标题 */}
        <header className="card-header-title">
          <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-lesson-name.svg')} />
          {course?.courseName}
        </header>
        <section>
          <Row style={{ marginLeft: '8px', height: 'calc(100vh - 110px)', overflow: 'auto', fontSize: 13 }} >
            <Col span={24}>
              {chapterList && chapterList.length > 0 ?
                chapterList.map((item, index) => {
                  const line = item.childrens?.map((cItem, cIndex) => {
                    if (cItem.publishStatus == 0) return;
                    return (
                      <div onClick={() => handleOnClickRow(cItem)} key={cItem.id}
                        className={showButton && showIndex == cItem.id ? 'panel-item sel-panel-item' : 'panel-item'}
                        style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          {cItem.serialNum + `  ` + cItem.catalogueName}
                        </div>
                        <div>
                          {
                            cItem.catalogueTaskNum == 0 ? <span className="layer-text-nothing" />
                              : (
                                cItem.catalogueScale == 100 ? <span className="layer-text-finish"><CheckOutlined /></span>
                                  : <span className="layer-text">{cItem.catalogueTaskNum}</span>
                              )
                          }
                        </div>
                      </div>
                    )
                  })
                  const headerStyle = showButton && showIndex == item.id ? 'panel-item-header sel-panel-item' : 'panel-item panel-item-header';
                  const isHidden = checkPanel.findIndex((e) => e == item.id) > -1 ? false : true;
                  return <div className="panel-item" key={item.id}>
                    <div onClick={() => handleOnClickRow(item)} className={headerStyle} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        {/* 收缩 */}
                        <DownOutlined onClick={() => switchNodeWrap(item.id)} hidden={isHidden} />
                        {/* 展开面板 */}
                        <UpOutlined onClick={() => switchNodeExpand(item.id)} hidden={!isHidden} />
                        <b>{`${item.serialNum}. ${item.catalogueName}`}</b>
                      </div>
                    </div>
                    <div className='panel-item-content' hidden={isHidden}>
                      {line}
                    </div>
                  </div>
                }) : ''
              }
            </Col>
          </Row>
        </section>
      </div>
    </>
  )
}

export default menuTree