import { useEffect, useState } from 'react';
import { Button, Collapse, Select, Col, Row, Switch, Progress, message, Tooltip } from 'antd';
import { api_getCatalogueByClass, api_saveCatalogueAuth }
  from '@/services/teacher/course/chapter';
import { api_getClassByLoginUser } from '@/services/teacher/clazz/sclass';
import { findRichTXT } from '@/services/resources/upload';
const { Panel } = Collapse;
import './index.less';
import ChapterClazzModal from '@/pages/common-course/chapter/components/ChapterClazzModal';
const { Option } = Select;
import { sortList } from './utils/utils'
import SuperIcon from "@/pages/components/icons";
import { QuestionCircleOutlined } from '@ant-design/icons';
declare const window: Window & { previewWindow: any };  // 声明window下previewWindow属性
import { CHAPTER } from '@/common/entity/chapter'

/**
 * 课程章节
 * @param props 
 * @returns 
 */
const ChapterIndex = (props: any) => {
  const courseId = props.courseId;
  const [publicModalVisible, handlePublicModalVisible] = useState<boolean>(false);// 开关弹框
  const [listData, setListData] = useState<CHAPTER.CourseCatalog[]>([]);//章节列表,后台给的数据肯定是>=1的
  const [defClazzId, setDefClazzId] = useState<number>(-1);//下拉框选中班级
  const [clazzList, setClazzList] = useState<API.SclassListRecord[]>([]);//未结束的班级列表
  const [courseCatalog, setCourseCatalog] = useState<CHAPTER.CourseCatalog>();//选中目录，打开发布窗口的数据

  const [showButton, setShowButton] = useState<boolean>(false);// 编辑按钮显示控制变量
  const [showIndex, setShowIndex] = useState<number>(-1); // 显示的按钮的排列顺序对应变量

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
   * 点击行
   * @param item 
   * @returns 
   */
  const clickLine = (item: any) => {
    setShowButton(true);
    setShowIndex(item.id);
    return item.id
  }
  /**
   * 切换班级，重新请求数据
   * @param val 
   */
  const handleClassChange = (val: number) => {
    setDefClazzId(val) //修改班级id值
    fetchCatalogList(val)
  }
  /**
   * 点击编辑跳转到目录内容编辑区
   * @param id 章节id 
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
    window.open(`/edit/chapter/${courseId}/${defClazzId}/${chapterId}`);
  }

  /**
   * 测试方法，打开新窗口进行内容输出
   * @param courseId 
   * @param chapterId 
   */
  const preview = async (courseId: number, chapterId: number) => {
    let contents = ''
    await findRichTXT(courseId, chapterId).then((res) => {
      if (res.success) {
        contents = res.obj.contents
      }
    })
    if (window.previewWindow) {
      window.previewWindow.close()
    }
    window.previewWindow = window.open()
    window.previewWindow.document.write(buildPreviewHtml(contents))
    window.previewWindow.document.close()
  }

  /**
   * 跳转到预览页面
   * @param chapterId 
   */
  const onView = (chapterId: number) => {
    // preview(courseId, chapterId)
    window.open(`/edit/preview/${courseId}/${defClazzId}/${chapterId}`);

  }
  // 预览输出模板
  const buildPreviewHtml = (content: any) => {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <script>
        function onLoadDataVideo(val,url) {
          let frame = document.getElementById(val)
          frame.contentWindow.postMessage({dataURL: url,dataID: val},'*');
        }
        function onLoadDataPdf(val,url) {
          let frame = document.getElementById(val)
          frame.contentWindow.postMessage({dataURL: url,dataID: val},'*');
        }
        </script>
        <body>
          <div class="container">${content}</div>
        </body>
      </html>
    `
  }

  /**
   * 跳转去统计
   * @param chapterId 
   */
  const goStatic = (e: React.MouseEvent, chapterId: number, serialNum: string) => {
    window.open(`/teacher/course/chapter/statis/list/${courseId}/${chapterId}/${defClazzId}/${serialNum}`);
    e.stopPropagation();
  }

  /**
   * 点击开关执行回调:弹出弹框进行操作
  */
  // const chapterPublic = (chapterId: number) => {
  //   api_getCatalogueAuth(courseId, chapterId).then((res) => {
  //     if (res.success) {
  //       console.log(' getCatalogueAuth res:', res.obj)
  //       setCourseCatalog(res.obj)
  //       handlePublicModalVisible(true)
  //     }
  //   })
  // };
  /**
   * 点击开关打开窗口
  */
  const chapterPublic = (record: CHAPTER.CourseCatalog) => {
    setCourseCatalog(record)
    handlePublicModalVisible(true)
  };

  /**
   * 一级菜单的进度条
   * @param item 
   * @returns 
   */
  const getFirstPanelHeader = (item: CHAPTER.CourseCatalog) => {
    return <Row>
      <Col span={18}>{'第' + item.serialNum + '章' + `  ` + item.catalogueName}</Col>
      <Col span={3}></Col>
      <Col span={3} style={{ textAlign: 'center' }}>
        {
          item.catalogueTaskNum > 0 && defClazzId > -1 &&
          <Tooltip title={`${item.catalogueScale}%`}>
            <div style={{ width: '100%' }} onClick={(e) => goStatic(e, item.id, item.serialNum)}>
              <Progress
                percent={Number(item.catalogueScale)}
                showInfo={false}
                trailColor='#e5e5e5'
                style={{ width: 100 }}
              />
            </div>
          </Tooltip>
        }
      </Col>
    </Row>
  }
  return (
    <div className="chapter">
      <div className="title-4">章节 <Button type="primary" onClick={() => onEdit(-1)} style={{ marginLeft: 40 }}><SuperIcon type="icon-icon-edit-3" />编辑章节</Button>
        {
          defClazzId > -1 &&
          <Select defaultValue={defClazzId} style={{ width: 120 }} onChange={handleClassChange} className="drop-right" >
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
          <Col span={3} style={{ textAlign: 'center' }}>
            发布状态
          </Col>
          <Col span={3} style={{ textAlign: 'center' }}>
            进度统计
            <Tooltip placement="topLeft" title={'一级目录统计=子目录带有任务点的和/子目录带有任务点目录和'}>
              <QuestionCircleOutlined style={{ marginLeft: 4 }} />
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {listData && listData.length > 0 ?
              <Collapse defaultActiveKey={defaultOpen()} className="site-collapse-custom-collapse" bordered={false}>
                {
                  listData.map((item, index) => {
                    const line = item.childrens?.map((cItem, cIndex) => {
                      return (
                        <Row className={showButton && showIndex == cItem.id ? 'panel-item-list panel-item-list-sel' : 'panel-item-list'} key={cItem.id} onClick={() => clickLine(cItem)}>
                          <Col span={8}>
                            {
                              cItem.catalogueTaskNum > 0 ? <span className="layer-text">{cItem.catalogueTaskNum}</span> : <span className="layer-text-nothing" />
                            }
                            <span style={{ paddingLeft: `${(cItem.catalogueLevel - 1) * 20}px` }}>{cItem.serialNum + `  ` + cItem.catalogueName}</span>
                          </Col>
                          <Col span={10}>
                            <Button type="primary" className={showButton && showIndex == cItem.id ? 'visible-css' : 'hidden-css'} onClick={() => onEdit(cItem.id)}>
                              <SuperIcon type="icon-icon-edit-3" />
                              编辑</Button>
                            <Button type="primary" className={showButton && showIndex == cItem.id ? 'visible-css' : 'hidden-css'}
                              style={{ backgroundColor: "#FDDF66", borderColor: '#FDDF66', color: '#442410', marginLeft: '20px' }} onClick={() => onView(cItem.id)}>
                              <SuperIcon type="icon-yulan" />
                              预览</Button>
                          </Col>
                          <Col span={3} className="center">
                            {
                              defClazzId > -1 &&
                              <Switch checked={cItem.publishStatus == 0 ? false : true} className="switch-change"
                                onClick={() => chapterPublic(cItem)} />
                            }
                          </Col>
                          <Col span={3} className="center">
                            {
                              defClazzId > -1 && cItem.catalogueTaskNum > 0 && cItem.publishStatus == 1
                              && <Tooltip title={`${cItem.catalogueScale}%`}>
                                <div onClick={(e) => goStatic(e, cItem.id, cItem.serialNum)}>
                                  <Progress percent={Number(cItem.catalogueScale)} showInfo={false}
                                    style={{ width: 100, marginRight: '1.5%' }}
                                    trailColor='#e5e5e5' />
                                </div>
                              </Tooltip>
                            }
                          </Col>
                        </Row>
                      )
                    })
                    return <Panel
                      // extra={genExtra(item)}
                      // header={'第' + item.serialNum + '章' + `  ` + item.catalogueName}
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
      {/* 发布弹框 */}
      {
        publicModalVisible && courseCatalog ? <ChapterClazzModal
          onSubmit={async (value: CHAPTER.CourseCatalog) => {
            console.log('value', value)
            /**
             * 暂定对班级不生效
             */
            value.classes = [];
            value.classId = defClazzId;
            api_saveCatalogueAuth(value).then((res) => {
              if (!res.success) {
                message.error(res.message)
                return;
              }
              //刷新表格
              fetchCatalogList(defClazzId);
              //关闭窗口
              handlePublicModalVisible(false);
            })
          }}
          onCancel={() => {
            //关闭窗口
            handlePublicModalVisible(false);
          }}
          visible={publicModalVisible}
          chapterClazz={courseCatalog}
          clazzInfo={clazzList.filter((item) => item.id == defClazzId)[0]}
        /> : null
      }
    </div>
  );
};
export default ChapterIndex;



