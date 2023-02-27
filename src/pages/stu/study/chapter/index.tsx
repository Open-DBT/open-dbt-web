import { useEffect, useState } from 'react';
import { Button, Collapse, Select, Col, Row, Switch, Progress, message, Tooltip } from 'antd';
import { getCatalogueByStu } from '@/services/student/course/chapter';
const { Panel } = Collapse;
import { history, useModel } from 'umi';
import './index.less';
import { sortList } from './utils/utils'
import {
  CheckOutlined
} from '@ant-design/icons';
declare const window: Window & { previewWindow: any };  // 声明window下previewWindow属性
import { CHAPTER } from '@/common/entity/chapter'

type IProp = {
  courseId: number;
  clazzId: number;
};

/**
 * 课程-章节首页
 * @param props 
 * @returns 
 */
const StudentChapterIndex = (props: IProp) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const courseId = props.courseId;
  const defClazzId = props.clazzId;
  const [listData, setListData] = useState<CHAPTER.CourseCatalog[]>([]);//章节列表,后台给的数据肯定是>=1的
  const [currentItemNum, setCurrentItemNum] = useState<number>(0);//当前完成任务数
  const [allItemNum, setAllItemNum] = useState<number>(0);//总任务数
  const [showButton, setShowButton] = useState<boolean>(false);// 编辑按钮显示控制变量
  const [showIndex, setShowIndex] = useState<number>(-1); // 显示的按钮的排列顺序对应变量
  const [isTeacherBol, setIsTeacherBol] = useState<boolean>(false);// 开关弹框

  useEffect(() => {
    fetchCatalogList();
    if (currentUser!.roleList!.length > 0 && currentUser!.roleType == 4) {
      let item = currentUser!.roleList!.filter((item) => item.roleId == 3)
      if (item.length > 0) {
        setIsTeacherBol(true)
      } else {
        setIsTeacherBol(false)
      }
    }
  }, []);

  /**
  * 获取章节目录数据
  * @returns 
  */
  const fetchCatalogList = () => {
    getCatalogueByStu(courseId).then((res) => {
      if (res.success) {
        setCurrentItemNum(res.obj.stuCompleteTaskNum)
        setAllItemNum(res.obj.stuAllTaskNum)
        if (res.obj.catalogueTreeList.length > 0) {
          let list = sortList(res.obj.catalogueTreeList) as CHAPTER.CourseCatalog[];
          setListData(list)
        } else setListData([])
      }
    })
  }
  /**
   * 设置默认打开的折叠模板
   * @returns 
   */
  const defaultOpen = () => {
    let arr = []
    for (let i = 0; i < listData.length; i++) {
      arr.push(listData[i].id + '')
    }
    return arr
  }
  /**
   * 点击行
   * @param item 
   * @returns 
   */
  const clickLine = (item: any) => {
    setShowButton(true);
    setShowIndex(item.id);
  }

  /**
   * 点击编辑跳转到目录内容编辑区
   * @param id 章节id 
   * @param publishStatus 是否发布
   */
  const onEdit = (chapterId: number) => {
    if (chapterId == -1 && listData.length > 0) {
      for (let i = 0; i < listData.length; i++) {
        //非空验证
        if (listData[i].childrens) {
          const parentNode = listData[i];
          for (let j = 0; j < parentNode.childrens.length; j++) {
            //循环查找非1级目录的子节点，第一个作为编辑内容
            chapterId = parentNode.childrens[j].id;
            j = parentNode.childrens.length;
            i = listData.length;
          }
        }
      }
    }
    window.open(`/stu/course/chapter/detail/${courseId}/${defClazzId}/${chapterId}`);
  }
  /**
   * @function 查看课程进度
   * 
   */
  const viewProgress = () => {
    const url = `/stu/course/chapter/process/${courseId}/${defClazzId}`;
    history.push(url);
  };
  return (
    <div className="chapter">
      <div className="title-4">章节
      </div>

      <div className="chapter-contnet" style={{ height: 'auto' }}>
        <Row style={{ marginBottom: 4 }}>
          <Col span={18} style={{ paddingLeft: '-1%', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            {
              !isTeacherBol && <>
                {currentItemNum == allItemNum && allItemNum != 0 ? <span className="layer-text-finish" style={{ marginLeft: '10px' }}><CheckOutlined /></span> : <span className="layer-text" style={{ lineHeight: '36px', marginLeft: '10px' }}></span>}
                <span style={{ marginLeft: '20px' }}>已完成任务点</span>
                <span style={{ marginLeft: '20px' }}>{currentItemNum}/{allItemNum}</span>
                <span style={{ marginLeft: '20px' }} className="viewProgress" onClick={() => { viewProgress() }}>查看进度</span>
              </>
            }
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {listData && listData.length > 0 ?
              <Collapse defaultActiveKey={defaultOpen()} className="site-collapse-custom-collapse" bordered={false}
              >
                {
                  listData.map((item, index) => {
                    const line = item.childrens?.map((cItem, cIndex) => {
                      if (cItem.publishStatus == 0) return;
                      return (
                        <Row className={showButton && showIndex == cItem.id ? 'panel-item-list panel-item-list-sel' : 'panel-item-list'} key={cItem.id} onClick={() => { clickLine(cItem); onEdit(cItem.id) }}>
                          <Col span={8}>
                            {
                              cItem.catalogueTaskNum > 0 && cItem.catalogueScale != 100 && cItem.publishStatus == 1 ? <span className="layer-text">{cItem.catalogueTaskNum}</span> : (cItem.catalogueScale == 100 && cItem.publishStatus == 1 ? <span className="layer-text-finish"><CheckOutlined /></span> : <span className="layer-text-nothing" />)
                            }
                            <span style={{ paddingLeft: `${(cItem.catalogueLevel - 1) * 20}px` }}>{cItem.serialNum + `  ` + cItem.catalogueName}</span>
                          </Col>
                          <Col span={10}></Col>
                        </Row>
                      )
                    })
                    return <Panel
                      header={'第' + item.serialNum + '章' + `  ` + item.catalogueName}
                      key={item.id + ''}
                      className="collapse-panel-item"
                    >
                      {line}
                    </Panel>
                  })
                }
              </Collapse> : ''
            }
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default StudentChapterIndex;



