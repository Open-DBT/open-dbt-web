import { useEffect, useState } from 'react';
import { Button, Collapse, Select, Col, Row } from 'antd';
import { api_getCatalogueByClass } from '@/services/teacher/course/chapter';
import { api_getClassByLoginUser } from '@/services/teacher/clazz/sclass';

const { Panel } = Collapse;
import './index.less';
const { Option } = Select;
import { sortList } from './utils/utils'
import { CHAPTER } from '@/common/entity/chapter'
import { API } from '@/common/entity/typings';

/**
 * 课程章节
 * @param props 
 * @returns 
 */
const ChapterIndex = (props: any) => {
  const courseId = props.courseId;
  const [listData, setListData] = useState<CHAPTER.CourseCatalog[]>([]);//章节列表,后台给的数据肯定是>=1的
  const [defClazzId, setDefClazzId] = useState<number>(-1);//下拉框选中班级
  const [clazzList, setClazzList] = useState<API.SclassListRecord[]>([]);//未结束的班级列表

  useEffect(() => {
    api_getClassByLoginUser(courseId).then((res) => {
      if (res.success) {
        setClazzList(res.obj)
        const defClazzId = res.obj.length > 0 ? res.obj[0].id : -1;
        setDefClazzId(defClazzId);
        fetchCatalogList(defClazzId);
      }
    })
  }, []);

  /**
  * 获取章节目录数据
  * @returns 
  */
  const fetchCatalogList = (clazzId: number) => {
    api_getCatalogueByClass(courseId, clazzId).then((res) => {
      if (res.success) {
        if (res.obj.catalogueTreeList && res.obj.catalogueTreeList.length > 0) {
          setListData(sortList(res.obj.catalogueTreeList) as CHAPTER.CourseCatalog[])
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
   * 一级菜单的进度条
   * @param item 
   * @returns 
   */
  const getFirstPanelHeader = (item: CHAPTER.CourseCatalog) => {
    return <Row>
      <Col span={18}>{'第' + item.serialNum + '章' + `  ` + item.catalogueName}</Col>
    </Row>
  }
  return (
    <div className="chapter">
      <div className="title-4">章节
        {
          defClazzId > -1 &&
          <Select defaultValue={defClazzId} style={{ width: 120 }} className="drop-right" >
            {
              clazzList.map((item) => {
                return <Option key={item.id} value={item.id}>{item.className}</Option>
              })
            }
          </Select>
        }
      </div>

      <div className="chapter-contnet" style={{ height: 'auto' }}>
        <Row style={{ marginBottom: 4 }}>
          <Col span={18} style={{ paddingLeft: '-1%' }}>目录</Col>
        </Row>
        <Row>
          <Col span={24}>
            {listData && listData.length > 0 ?
              <Collapse defaultActiveKey={defaultOpen()} className="site-collapse-custom-collapse" bordered={false}>
                {
                  listData.map((item, index) => {
                    const line = item.childrens?.map((cItem, cIndex) => {
                      return (
                        <Row className='panel-item-list' key={cItem.id}>
                          <Col span={18}>
                            {
                              cItem.catalogueTaskNum > 0 ? <span className="layer-text">{cItem.catalogueTaskNum}</span> : <span className="layer-text-nothing" />
                            }
                            <span style={{ paddingLeft: `${(cItem.catalogueLevel - 1) * 20}px` }}>{cItem.serialNum + `  ` + cItem.catalogueName}</span>
                          </Col>
                        </Row>
                      )
                    })
                    return <Panel
                      header={getFirstPanelHeader(item)}
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
export default ChapterIndex;



