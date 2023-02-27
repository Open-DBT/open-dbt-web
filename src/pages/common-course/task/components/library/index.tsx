import React, { useState, useEffect } from 'react'
import './index.less'
import logo from '@/img/logo-itol.png'
import { Table, Button, message, Input, TablePaginationConfig, Dropdown, Menu, Space, Breadcrumb, Modal } from 'antd';
import SuperIcon from "@/pages/components/icons";
import MoveModal from './component/file/move/moveModal'
const { Search } = Input;
import { history, useParams } from 'umi';
import EditMenuModal from './component/file/add/index';
import { ColumnsType, FilterValue, SorterResult } from 'antd/lib/table/interface';
import { QUESTION_BANK } from '@/common/entity/questionbank';
import { API } from '@/common/entity/typings';
import { getHomeWorkModel, saveHomeWorkModelFolder, copyHomeWorkModel, delHomeWorkModel, moveHomeWorkModel } from '@/services/teacher/task/task';
// 默认页数设置
const defPage = {
  current: 1,
  pageSize: 5,
  total: 0
}
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
  param?: any;
  orderBy?: string;
  parentId?: number;
}
const TaskLibrary = () => {
  const params: any = useParams();  // url参数
  const courseId = params.courseId; // 课程id
  const [moveModelVisible, setMoveModelVisible] = useState(false);  // 移动到弹框显示变量
  const [order, setOrder] = useState<string>('');  // 排序关键字
  const [clickFile, setClickFile] = useState<{ label: string, value: number }[]>([{ label: '全部题目', value: 0 }]);  // 面包屑导航数组
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defPage,
    parentId: 0,//目录父级id
  });
  const [selectId, setSelectId] = useState<number>(-1); //选中id
  const [checkId, setCheckId] = useState<number>(-1); //操作id
  const [editNameModalVisible, handEditNameModalVisible] = useState<boolean>(false);  // 修改目录标题，开关弹框
  const [renameBol, setRenameBol] = useState<boolean>(false); // 修改文件夹弹框 true: 修改 false: 新增
  const [keyWord, setkeyWord] = useState<string>('');  // 关键字
  const [data, setData] = useState<{ count: number, list: any[] }>({ count: 0, list: [] });
  const [rename, setRename] = useState<string>('');  // 存储的需要修改的文件夹名称
  const [clickMore, setClickMore] = useState<any>(); //点击更多存储当前行数据
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a style={{ color: '#23dba7' }} onClick={() => showMoveModal(clickMore.id)}>
              移动到
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a style={{ color: '#23dba7' }} onClick={() => copyLineData(Number(clickMore.id))}>
              复制
            </a>
          ),
        },
        {
          key: '3',
          label: (
            <a style={{ color: '#23dba7' }} onClick={() => deleteLineData(Number(clickMore.id))}>
              删除
            </a>
          ),
        },
      ]}
    />
  );
    const columnsTaskLibrary: ColumnsType<QUESTION_BANK.QuestionBankRecord> = [
    {
      title: '文件夹/题目',
      dataIndex: 'modelName',
      width: '500px',
      ellipsis: true,
      key: 'modelName',
      render: (item, record) => {
        return (<div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button type="link" onClick={() => clickLink(record)} className="link-name">
            {
              record.elementType == 1 && <SuperIcon type="icon-icon-folder" style={{ verticalAlign: 'middle', fontSize: '1.2rem', marginRight: '5px' }} />
            }
            {item}
          </Button>
          {
            selectId == record.id && (record.elementType == 0 ?
              <>
                <div style={{ position: 'absolute', right: '0', background: '#fff', zIndex: '5' }}>
                  <Button type="primary" style={{ marginRight: 10 }} onClick={() => clickPublish(record)}>发布</Button>
                  <Button type="text" style={{ marginRight: 10, color: '#23dba7' }} onClick={() => clickEdit(record)}>编辑</Button>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <a onClick={e => { e.preventDefault(); setClickMore(record) }}>
                      <Space>
                        更多
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              </> :
              <>
                <div style={{ position: 'absolute', right: '0', background: '#fff', zIndex: '5' }}>
                  <Button type="link" onClick={() => { renameFile(); setCheckId(record.id); setRename(item) }}>重命名</Button>
                  <Button type="link" onClick={() => showMoveModal(record.id)}>移动到</Button>
                  <Button type="link" onClick={() => deleteLineData(Number(record.id))}>删除</Button>
                </div>
              </>)
          }
        </div>)
      }
    },
    {
      title: '创建人',
      dataIndex: 'userName',
      align: 'center',
      key: 'userName',
      width: '100px'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      key: 'createTime',
      width: '200px',
      sorter: true,
    },
  ];
  // useEffect(() => {
  //   //非空校验
  //   // ValidateIntegerParam(courseId);
  // }, [])

  useEffect(() => {
    courseId && fetchData();
  }, [JSON.stringify(tableParams), order])

  useEffect(() => {
    courseId && order.length > 0 && fetchData();
  }, [order])

  useEffect(() => {
    courseId && fetchData();
  }, [keyWord])

  const getRandomuserParams = (params: TableParams) => ({
    pageSize: params.pagination?.pageSize,
    pageNum: params.pagination?.current,
    ...params,
  });
  /**
 * 查询表格数据
 */
  const fetchData = () => {
    const param = {
      parentId: tableParams.parentId,
      courseId: courseId,
      modelName: keyWord,
    }
    getHomeWorkModel(getRandomuserParams({ ...tableParams, param, orderBy: order })).then((res) => {
      setData({ count: res.count, list: res.list })
      setTableParams({ ...tableParams, pagination: res.pagination })
    })
  };
  /**
   * 关键字搜索
   * @param value 
   * @returns 
   */
  const onSearch = (value: string) => {
    setkeyWord(value.trim())
  }
  /**
   * 移动提交函数
   * @param oldId 
   * @param newId 
   */
  const handleMoveSubmit = async (oldId: number, newId: number) => {
    moveHomeWorkModel(oldId, newId).then((res) => {
      if (!res.success) {
        message.error(res.message)
        return;
      }
      message.success('移动成功');
      validateIsFirstNum()
      setMoveModelVisible(false);
    })
  }
  /**
 * 打开移动功能窗口
 * @param id 
 */
  const showMoveModal = (id: number) => {
    setMoveModelVisible(true);
    setCheckId(id)
  };
  /**
* 复制数据方法
* @param id 习题id
*/
  const copyLineData = (id: number) => {
    // 调用复制接口
    copyHomeWorkModel(id).then((res: any) => {
      if (res.success) {
        fetchData();
        message.success('复制成功');
      } else {
        message.error(res.message);
      }
    })
  }
  /**
 * 仅用于移动和删除，如果当前不是第一页，并且列表中只有一条，页码-1
 * @returns 
 */
  const validateIsFirstNum = () => {
    //判断不是第1页，并且当前页只有1条数据
    if (tableParams.pagination?.current != 1 && data.list.length == 1) {
      //当前页-1
      setTableParams({ ...tableParams, pagination: { ...tableParams.pagination, current: tableParams.pagination?.current! - 1 } })
      return;
    }
    //当前列表>1条数据，刷新表格。
    fetchData();
  }
  /**
* 删除习题方法
* @param id 习题id
*/
  const deleteLineData = (id: number) => {
    Modal.confirm({
      title: '删除确认框',
      content: '确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 调用删除接口
        delHomeWorkModel(id).then((res: API.Result<boolean>) => {
          if (res.success) {
            message.success('删除成功');
            validateIsFirstNum();
          } else message.error(res.message);
        })
      },
    });
  }
  /**
* 重命名
*/
  const renameFile = () => {
    handEditNameModalVisible(true)
    setRenameBol(true)
  }
  /**
   * 编辑
   */
  const clickEdit = (record: any) => {
    history.push({ pathname: `/task-bank/addTask/courseId/parentId/${courseId}/${record.parentId}`, state: { modelId: record.id, publish: record.publishStatus } })
  }
  /**
   * 发布
   */
  const clickPublish = (record: any) => {
    if (record.exist == 0) {
      message.warning('该作业模板未完成， 不允许发布!')
      return
    } else {
      history.push({ pathname: `/task-bank/publishTask/courseId/taskId/${courseId}/${record.id}`, state: { taskName: record.modelName } })
    }
  }

  /**
 * 表格事件
 * @param pagination 
 * @param filters 
 * @param sorter 
 */
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<QUESTION_BANK.QuestionBankRecord>,
  ) => {
    if (JSON.stringify(pagination) != JSON.stringify(tableParams.pagination)) {
      //调用hook刷新,切换当前页、切换每页数量
      setTableParams({ ...tableParams, pagination });
    } else {
      // 排序，order: "ascend" field: "createTime" ascend/descend
      const order = `${sorter.field} ${sorter.order ? sorter.order.substring(0, sorter.order.length - 3) : ''}`;
      setOrder(order);
    }
  };
  // 点击文件(进入文件夹)、题目名称(打开习题详情)
  const clickLink = (row: QUESTION_BANK.QuestionBankRecord) => {
    if (row.elementType == 0) {
      // 题目跳转到详情

      window.open(`/task-bank/taskDetail/taskId/${row.id}`)
    } else if (row.elementType == 1) {
      // 文件夹查询当前的列表
      setClickFile(() => [...clickFile, { label: row.modelName, value: row.id }])
      setTableParams({ ...tableParams, pagination: { ...tableParams.pagination, current: 1 }, parentId: row.id })
    }
  }
  /**
 * 进入面包屑
 * @param id 
 * @param index 
 */
  const clickSelectTab = (id: number, index: number) => {
    setClickFile(() => [...clickFile.slice(0, index + 1)])
    setTableParams({ ...tableParams, pagination: { ...tableParams.pagination, current: 1 }, parentId: id })

  }
  /**
  * 新建文件夹
  */
  const addNewFile = () => {
    setRename('')
    setCheckId(-1)
    handEditNameModalVisible(true)
    setRenameBol(false)
  }
  return (
    <div className='custom-single'>
      <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
        <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
          <div className='header-logo'>
            <img src={logo} alt="" onClick={() => history.push('/')} />
          </div>
        </div>
      </div>

      <div className='library-bank main-container'>
        <div className='content'>
          <div className="title-4">作业库</div>
          <div>
            <div className="library-tool library-flex">
              <div>
                <Button type="primary" onClick={() => window.open(`/task-bank/addTask/courseId/parentId/${courseId}/${tableParams.parentId}`)}><SuperIcon type="icon-jiahao" />创建作业</Button>
                {/* <Button style={{ background: '#FDDF66', marginLeft: '20px' }}><SuperIcon type="icon-icon-import" />一键导入</Button> */}
                <Button style={{ marginLeft: '20px' }} onClick={() => addNewFile()}><SuperIcon type="icon-xinjianwenjianjia" />新建文件夹</Button>
              </div>
              <div>
                {/* <Button type="text">导出全部</Button> */}
                <Search placeholder="关键词搜索" onSearch={onSearch} style={{ width: 200 }} />
              </div>
            </div>
            <div className="library-tool">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumb separator=">" className='breader-line'>
                  {
                    clickFile && clickFile.map((item, index) => {
                      return <Breadcrumb.Item className='breader-class' key={'Breadcrumb' + index} onClick={() => { clickSelectTab(item.value, index) }}>{item.label}</Breadcrumb.Item>
                    })
                  }
                </Breadcrumb>
                <span>共{data.count}题</span>
              </div>
              {
                <Table
                  columns={columnsTaskLibrary}
                  rowKey={record => record.id}
                  dataSource={data.list}
                  pagination={tableParams.pagination}
                  // loading={loading}
                  onChange={handleTableChange}
                  onRow={record => {
                    return {
                      onMouseEnter: event => {
                        setSelectId(record.id)
                      }, // 鼠标移入行
                      onMouseLeave: event => {
                        setSelectId(-1)
                      },
                    };
                  }}
                />
              }
            </div>
          </div>
        </div>
      </div>
      <MoveModal
        checkId={checkId}
        moveModelVisible={moveModelVisible}
        onCancel={() => {
          setMoveModelVisible(false);
        }}
        onSubmit={(oldId: number, newId: number) => handleMoveSubmit(oldId, newId)}
      />
      {
        editNameModalVisible &&
        <EditMenuModal
          onSubmit={async (value: string) => {
            let param = {
              courseId: params.courseId,
              parentId: tableParams.parentId,
              authType: 2,
              modelName: value,
              id: checkId != -1 ? checkId : ''
            }
            saveHomeWorkModelFolder(param).then((res: API.Result<boolean>) => {
              if (!res.success) {
                message.error(res.message)
                return;
              } else {
                message.success(res.message)
                fetchData()
              }
              handEditNameModalVisible(false);
            })
          }}
          checkName={rename}
          onCancel={() => handEditNameModalVisible(false)}
          visible={editNameModalVisible}
          name={renameBol ? '修改文件夹名称' : '新建文件夹'}
        />
      }
    </div>
  )
}

export default TaskLibrary