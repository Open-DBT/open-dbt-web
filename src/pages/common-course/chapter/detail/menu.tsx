
import { Affix, Button, Col, Row, Tooltip, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, UpOutlined } from '@ant-design/icons';
import { api_getCatalogueByClass, api_saveCatalogue, api_updateCatalogue, api_delCatalogue, api_moveUp, api_moveDown }
  from '@/services/teacher/course/chapter';
import { DownOutlined } from '@ant-design/icons';
import EditMenuModal from '@/pages/common-course/chapter/detail/components/EditMenuModal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getCourseDetail } from '@/services/teacher/course/course';
import { sortList } from '../utils/utils'
import SuperIcon from "@/pages/components/icons";
import { history } from 'umi';
import { CHAPTER } from '@/common/entity/chapter'
import { API } from '@/common/entity/typings';

interface IProps {
  courseId: number;
  clazzId: number;
  chapterId: number;
  setIsLevelFirst: (flag: boolean) => void;
}
/**
 * 章节编辑，左侧目录
 * @param props 
 * @returns 
 */
const menuTree = (props: IProps) => {
  const courseId = props.courseId;
  const clazzId = props.clazzId;
  const chapterId = props.chapterId;
  const [editNameModalVisible, handEditNameModalVisible] = useState<boolean>(false);// 修改目录标题，开关弹框
  const [listData, setListData] = useState<CHAPTER.CourseCatalog[]>([]);
  const [showButton, setShowButton] = useState<boolean>(false);// 编辑按钮显示控制变量
  const [showIndex, setShowIndex] = useState<number>(chapterId); // 选中对象对应id
  const [showData, setShowData] = useState<CHAPTER.CourseCatalog>(); // 选中的对象element
  const [checkPanel, setCheckPanel] = useState<number[]>([]);//哪些panel节点需要展开
  const [course, setCourse] = useState<API.CourseListItem>();//课程对象
  const {
    setIsLevelFirst: setIsLevelFirst
  } = props;
  /**
   * init
   */
  useEffect(() => {
    fetchChapterList();
    //查询课程详情，用于显示课程名称
    getCourseDetail(courseId).then((result) => {
      if (result.success) setCourse(result.obj)
    })
  }, []);

  /**
   * 切换章节id
   */
  useEffect(() => {
    selectNode(chapterId, listData)
  }, [chapterId]);

  /**
  * 获取章节目录数据
  * @returns 
  */
  const fetchChapterList = () => {
    api_getCatalogueByClass(courseId, clazzId).then((res) => {
      if (res.success) {
        let list = sortList(res.obj.catalogueTreeList) as CHAPTER.CourseCatalog[];
        setListData(list)
        selectNode(showIndex, list)
        //保存展开的id
        const expandIds = list.map((item) => {
          return item.id;
        })
        setCheckPanel(expandIds);
      }
    })
  }
  /**
   * 跳转到其他目录
   */
  const jumpChapter = async (item: CHAPTER.CourseCatalog) => {
    clickLine(item)
  }
  /**
   * 选中行
   * @param item 
   * @returns 
   */
  const clickLine = (item: CHAPTER.CourseCatalog) => {
    setShowButton(true);
    setShowIndex(item.id);
    setShowData(item);
    history.replace(`/edit/chapter/${courseId}/${clazzId}/${item.id}`)
    return item.id
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
        //选中行操作
        clickLine(item)
        return
      }
      //递归查找到当前节点
      if (item.childrens) selectNode(id, item.childrens);
    })
  };
  /**
   * 删除id后，重定向选中，向上或者向下
   * @param id 
   * @param data 
   * @returns 
   */
  const deleteAfterResetNode = (id: number, data: CHAPTER.CourseCatalog[]) =>
    data.forEach((item, index) => {
      if (item.id === id) {
        if (data.length > 1) {
          //如果存在同级节点，reset
          const arrIndex = index == 0 ? index + 1 : index - 1;
          setShowIndex(data[arrIndex].id)
        } else {
          //查找父节点，reset
          const upNode = listData.find((element) => element.id == item.parentId)!;
          clickLine(upNode);
        }
        return;
      } else {
        if (item.childrens) {
          deleteAfterResetNode(id, item.childrens);
        }
      }
    });

  /**
   * 根据选中节点id，删除课程目录
   * @param id 章节id
   */
  const onDel = (id: number) => {
    api_delCatalogue(id).then((resp) => {
      console.log('getCatalogue resp ', resp)
      if (!resp.success) {
        message.error(resp.message);
        return;
      }
      message.success('删除成功')
      //重置选中节点
      deleteAfterResetNode(id, listData)
      fetchChapterList();//更新
    })
  };
  /**
   * 找到选中位置，请求上移接口
   * @param id 
   * @param data 
   */
  const upNode = (id: number, data: CHAPTER.CourseCatalog[]) => {
    data.forEach((item) => {
      if (item.id == id) {
        api_moveUp(id as number).then((resp) => {
          console.log('api_moveUp resp ', resp)
          if (!resp.success) {
            message.error(resp.message);
            return;
          }
          fetchChapterList();//刷新
        })
        return;
      }
      if (item.childrens) upNode(id, item.childrens);
    });
  }
  /**
   * 目录上移
   */
  const onUp = () => {
    if (!showIndex) {
      message.warning('请选择节点')
      return;
    }
    upNode(showIndex as number, listData)
  }
  /**
  * 找到选中位置，请求上移接口
  * @param id 
  * @param data
  */
  const downNode = (id: number, data: CHAPTER.CourseCatalog[]) => {
    data.forEach((item) => {
      if (item.id == id) {
        api_moveDown(id as number).then((resp) => {
          console.log('api_moveUp resp ', resp)
          if (!resp.success) {
            message.error(resp.message);
            return;
          }
          fetchChapterList();//刷新
        })
        return;
      }
      if (item.childrens) downNode(id, item.childrens);
    });
  }
  /**
 * 目录下移
 */
  const onDown = () => {
    if (!showIndex) {
      message.warning('请选择节点')
      return;
    }
    downNode(showIndex as number, listData)
  }
  /**
   * 添加同级目录
   * ========在这里解释下为什么add/move后重新请求list，因为不能解决序号问题，如果有好办法，可以替换重新请求的list
   * @returns 
   */
  const onAddSame = () => {
    //验证是否选中
    if (!showData) {
      message.error('请选择一个目录');
      return;
    }
    /**
     * 对选中的节点进行同级目录添加
     */
    api_saveCatalogue(courseId, showData.parentId, '新建课程目录').then((resp) => {
      console.log('saveCatalogue resp ', resp)
      if (!resp.success) {
        message.error(resp.message)
        return;
      }
      fetchChapterList();//刷新    
    })
  };
  /**
 * 添加子目录
 */
  const onAddChildren = () => {
    //验证是否选中
    if (!showData) {
      message.error('请选择一个目录');
      return;
    }
    // addChildrenNode(showIndex as number, listData)
    api_saveCatalogue(courseId, showIndex, '新建课程目录').then((resp) => {
      console.log('api_saveCatalogue resp ', resp)
      if (!resp.success) {
        message.error(resp.message)
        return;
      }
      fetchChapterList();//刷新    
    })
  }
  /**
   * 点击编辑按钮，弹出窗口
   */
  const openEdit = () => {
    handEditNameModalVisible(true)
  };
  /**
   * 删除确认框
   */
  const confirm = (chapterId: number) => {
    Modal.confirm({
      title: '删除确认框',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除节点吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        onDel(chapterId)
      },
    });
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
  /**
   * 添加工具栏
   * @param item 
   * @returns 
   */
  const addButtons = (item: CHAPTER.CourseCatalog) => {
    return <div>
      <Tooltip title="编辑">
        <SuperIcon type="icon-icon-edit-3" onClick={() => openEdit()} className='panel-item-edit-icon' style={{ verticalAlign: 'middle', fontSize: '1.2rem', color: '#fff' }} />
      </Tooltip>
      <Tooltip title="删除">
        <SuperIcon type="icon-icon-delete-2" onClick={() => confirm(item.id)} className='panel-item-del-icon' style={{ verticalAlign: 'middle', fontSize: '1.2rem', fill: '#fff' }} />
        {/* <img src={require('@/img/teacher/teachingbook/icon-close-2.svg')} width="16px"
          onClick={() => confirm(item.id)} className='panel-item-del-icon'></img> */}
      </Tooltip>
    </div>
  }

  return (
    <div>
      <Affix offsetTop={56}>
        <div className="chapter-edit-menu">
          {/* 头部标题 */}
          <header className="card-header-title">
            <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-lesson-name.svg')} />
            {course?.courseName}
          </header>
          {/* 按钮 */}
          <nav className='menu-nav'>
            <Button icon={<PlusOutlined />} style={{ borderRadius: '5px', marginRight: '10px' }} onClick={() => onAddSame()}>同级目录</Button>
            <Button icon={<PlusOutlined />} style={{ borderRadius: '5px', marginRight: '10px' }} onClick={() => onAddChildren()}>子目录</Button>
            <Button icon={<ArrowUpOutlined />} style={{ borderRadius: '5px', marginRight: '10px' }} onClick={() => onUp()}></Button>
            <Button icon={<ArrowDownOutlined />} style={{ borderRadius: '5px' }} onClick={() => onDown()}></Button>
          </nav>
          <section>
            <Row style={{ marginLeft: '8px', height: 'calc(100vh - 165px)', overflow: 'auto', fontSize: 13 }} >
              <Col span={24}>
                {listData && listData.length > 0 ?
                  listData.map((item) => {
                    const line = item.childrens?.map((cItem) => {
                      return (
                        <div onClick={() => jumpChapter(cItem)} className={showButton && showIndex == cItem.id ? 'panel-item sel-panel-item' : 'panel-item'} key={cItem.id}
                          style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            {cItem.serialNum + `  ` + cItem.catalogueName}
                          </div>
                          {
                            showIndex == cItem.id && addButtons(cItem)
                          }
                        </div>
                      )
                    })
                    const headerStyle = showButton && showIndex == item.id ? 'panel-item-header sel-panel-item' : 'panel-item panel-item-header';
                    const isHidden = checkPanel.findIndex((e) => e == item.id) > -1 ? false : true;
                    return <div className="panel-item" key={item.id}>
                      <div onClick={() => jumpChapter(item)} className={headerStyle} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          {/* 收缩 */}
                          <DownOutlined onClick={() => switchNodeWrap(item.id)} hidden={isHidden} />
                          {/* 展开面板 */}
                          <UpOutlined onClick={() => switchNodeExpand(item.id)} hidden={!isHidden} />
                          <b>{`${item.serialNum}. ${item.catalogueName}`}</b>
                        </div>
                        {
                          showIndex == item.id && addButtons(item)
                        }
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
      </Affix>

      {
        editNameModalVisible && showData && showIndex > -1 ?
          <EditMenuModal
            onSubmit={async (value: string) => {
              console.log('onSubmit value', value)
              showData.catalogueName = value;
              api_updateCatalogue(showData).then((res) => {
                if (!res.success) {
                  message.error(res.message)
                  return;
                }
                handEditNameModalVisible(false);
              })
            }}
            onCancel={() => handEditNameModalVisible(false)}
            visible={editNameModalVisible}
            name={showData.catalogueName}
          /> : null
      }
    </div>
  )
}

export default menuTree