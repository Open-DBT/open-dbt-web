import React, { useEffect, useState } from 'react';
import { Table, Button, message, Breadcrumb, Select, Input, Checkbox, Modal, TablePaginationConfig } from 'antd';
import SuperIcon from "@/pages/components/icons";
import { getCourseDetail } from '@/services/teacher/course/course';
import { useParams } from 'umi'
import { copyExercise, deleteExercise, saveExerciseCatalogue, moveExercise } from '@/services/teacher/course/question-create';
import { api_getExercise } from '@/services/teacher/course/question-bank';
import './index.less';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
const { Option } = Select;
import MoveModal from './component/file/move/moveModal'
import { QUESTION_BANK } from '@/common/entity/questionbank';
import CODE_CONSTANT from '@/common/code'
import { API } from '@/common/entity/typings';
import EditMenuModal from './component/file/add/index';
import { ColumnsType, FilterValue, SorterResult } from 'antd/lib/table/interface';
import { ValidateIntegerParam } from '@/utils/utils'

//题目类型
const typeList = [
  { id: 1, name: '单选题' },
  { id: 2, name: '多选题' },
  { id: 3, name: '判断题' },
  { id: 4, name: '填空题' },
  { id: 5, name: '简答题' },
  { id: 6, name: 'SQL编程题' },
]
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
  param?: any;
  orderBy?: string;
  parentId?: number;
}

const defPage = {
  current: 1,
  pageSize: 5,
  total: 0
}
/**
 * 题库
 * @param props 
 * @returns 
 */
const QuestionsHome = (props: any) => {
  const params: any = useParams();
  const courseId = params.courseId;
  const [course, setCourse] = useState<API.CourseListItem | undefined>(undefined); //课程
  const [data, setData] = useState<{ count: number, list: QUESTION_BANK.QuestionBankRecord [] }>({ count: 0, list: [] });
  const [moveModelVisible, setMoveModelVisible] = useState(false);
  const [checkList_q, setCheckList_q] = useState<number[]>(typeList.map((item) => item.id)); //题库选择器，默认值全选
  const [indeterminate_q, setIndeterminate_q] = useState(true);//题库全选style控制
  const [checkAll_q, setCheckAll_q] = useState(false);//题库全选，数据记录
  const [selectId, setSelectId] = useState<number>(-1); //选中id
  const [checkId, setCheckId] = useState<number>(-1); //操作id
  const [editNameModalVisible, handEditNameModalVisible] = useState<boolean>(false);// 修改目录标题，开关弹框
  const [renameBol, setRenameBol] = useState<boolean>(false);// 修改文件夹弹框 true: 修改 false: 新增
  const [clickFile, setClickFile] = useState<{ label: string, value: number }[]>([{ label: '全部题目', value: 0 }]);
  const [keyWord, setkeyWord] = useState<string>('');  // 关键字
  const [knowledge, setknowledge] = useState<string>('');  // 知识点关键字
  const [rename, setRename] = useState<string>('');  // 存储的需要修改的文件夹名称
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defPage,
    parentId: 0,//目录父级id
  });
  const [order, setOrder] = useState<string>('');  // 排序关键字

  useEffect(() => {
    //非空校验
    ValidateIntegerParam(courseId);
    //查询课程名称
    getCourseDetail(courseId).then((resp) => {
      if (resp.success) setCourse(resp.obj)
    });
    //监听浏览器tabs创建习题
    window.onstorage = function (e) {
      localStorage.removeItem("refresh-question")
      setClickFile(() => [...clickFile.slice(0, 1)])
      fetchData()
    };
  }, [])

  useEffect(() => {
    // debugger
    courseId && fetchData();
  }, [JSON.stringify(tableParams)])

  useEffect(() => {
    courseId && order.length > 0 && fetchData();
  }, [order])

  const getRandomuserParams = (params: TableParams) => ({
    pageSize: params.pagination?.pageSize,
    pageNum: params.pagination?.current,
    ...params,
  });

  /**
   * 点击筛选按钮
   */
  const queryButtonClick = () => {
    //校验是否选择题型
    if (checkList_q.length == 0) {
      message.info('请选择题型');
      return;
    }
    if (tableParams.pagination?.current == 1) fetchData();
    else setTableParams({ ...tableParams, pagination: { ...tableParams.pagination, current: 1 } })
  }
  /**
   * 查询表格数据
   */
  const fetchData = () => {
    //如果是全部题型，转成空数组--对应后台接口
    const exerciseTypeList = checkList_q.length == typeList.length ? [] : checkList_q;
    const param = {
      parentId: tableParams.parentId,
      courseIdList: [courseId],
      exerciseName: keyWord,
      exerciseTypeList: exerciseTypeList,
      knowledge: knowledge,
    }
    api_getExercise(getRandomuserParams({ ...tableParams, param, orderBy: order })).then((res) => {
      setData({ count: res.count, list: res.list })
      setTableParams({ ...tableParams, pagination: res.pagination })
    })
  };

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

  const columnsQuestion: ColumnsType<QUESTION_BANK.QuestionBankRecord> = [
    {
      title: '文件夹/题目',
      dataIndex: 'exerciseName',
      width: '500px',
      ellipsis: true,
      key: 'exerciseName',
      render: (item, record) => {
        return (<div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button type="link" onClick={() => clickLink(record)} className="link-name">
            {
              record.elementType == 1 && <SuperIcon type="icon-icon-folder" style={{ verticalAlign: 'middle', fontSize: '1.2rem', marginRight: '5px' }} />
            }
            {item}
            {
              record.elementType == 1 && <span className='span-count'>共{record.childCount}题</span>
            }
          </Button>
          {
            selectId == record.id && (record.elementType == 0 ?
              <>
                <div style={{ position: 'absolute', right: '0', background: '#fff', zIndex: '5' }}>
                  <Button type="link" onClick={() => { window.open(`/question-bank/edit/courseId/exerciseId/parentId/${Number(params.courseId)}/${record.id}/${tableParams.parentId}`) }}>编辑</Button>
                  <Button type="link" onClick={() => showMoveModal(record.id)}>移动</Button>
                  <Button type="link" onClick={() => copyLineData(Number(record.id))}>复制</Button>
                  <Button type="link" onClick={() => deleteLineData(Number(record.id))}>删除</Button>
                </div>
              </> :
              <>
                <div style={{ position: 'absolute', right: '0', background: '#fff', zIndex: '5' }}>
                  <Button type="link" onClick={() => { renameFile(); setCheckId(record.id); setRename(item) }}>重命名</Button>
                  <Button type="link" onClick={() => deleteLineData(Number(record.id))}>删除</Button>
                </div>
              </>)
          }
        </div>)
      }
    },
    {
      title: '题型',
      dataIndex: 'exerciseType',
      align: 'center',
      key: 'exerciseType',
      width: '100px',
      render: (item, record) => {
        return <span>{CODE_CONSTANT.questionType[Number(item) - 1]}</span>
      }
    },
    {
      title: '难度',
      dataIndex: 'exerciseLevel',
      align: 'center',
      key: 'exerciseLevel',
      sorter: true,
      width: '100px',
      render: (item, record) => {
        return record.elementType == 0 ? <span>{CODE_CONSTANT.exerciseLevel[Number(item) - 1]}</span> : ''
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
  /**
   * 复制数据方法
   * @param id 习题id
   */
  const copyLineData = (id: number) => {
    // 调用复制接口
    copyExercise(id).then((res) => {
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
        deleteExercise(id).then((res: API.Result<boolean>) => {
          if (res.success) {
            message.success('删除成功');
            validateIsFirstNum();
          } else message.error(res.message);
        })
      },
    });
  }

  /**
   * 移动提交函数
   * @param oldId 
   * @param newId 
   */
  const handleMoveSubmit = async (oldId: number, newId: number) => {
    moveExercise(oldId, newId).then((res) => {
      if (!res.success) {
        message.error(res.message)
        return;
      }
      message.success('移动成功');
      validateIsFirstNum()
      setMoveModelVisible(false);
    })
  }
  /**===================题库============================= */
  /**
   * checkbox题库的钩子
   */
  useEffect(() => {
    setIndeterminate_q(!!typeList.length && typeList.length < checkList_q.length);
    setCheckAll_q(checkList_q.length === typeList.length);

  }, [checkList_q]);

  /**
   * 题库checkbox全选事件
   * @param e 
   */
  const onCheckAllChange_q = (e: CheckboxChangeEvent) => {
    setCheckList_q(e.target.checked ? typeList.map((e) => e.id) as number[] : []);
    setIndeterminate_q(false);
    setCheckAll_q(e.target.checked);
  };
  /**
   * 题库checkbox勾选事件
   * @param e 
   */
  const onCheckChange_q = (e: CheckboxChangeEvent) => {
    //查找数组中是否包含本选项
    const index = checkList_q.findIndex((item) => item == e.target.value);
    //勾选，数组添加元素
    e.target.checked && index == -1 && setCheckList_q([...checkList_q, e.target.value]);
    //取消勾选，数组移除元素
    !e.target.checked && index > -1 && setCheckList_q(checkList_q.filter((item) => item != e.target.value));
  };

  /**==================================== */
  /**
   * 知识点关键字change
   * @param value 
   * @returns 
   */
  const onChangeKnowLege = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setknowledge(e.target.value.trim())
  };

  /**
   * 习题关键字change
   * @param value 
   * @returns 
   */
  const onChangeKeyWord = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setkeyWord(e.target.value.trim())
  };

  /**
   * 打开移动功能窗口
   * @param id 
   */
  const showMoveModal = (id: number) => {
    setMoveModelVisible(true);
    setCheckId(id)
  };
  /**
   * 新建文件夹
   */
  const addNewFile = () => {
    setRename('')
    setCheckId(-1)
    handEditNameModalVisible(true)
    setRenameBol(false)
  }
  /**
   * 重命名
   */
  const renameFile = () => {
    handEditNameModalVisible(true)
    setRenameBol(true)
  }

  /**
   * 创建习题
   */
  const clickCreateQuestion = () => {
    window.open(`/question-bank/create/courseId/parentId/${Number(params.courseId)}/${Number(tableParams.parentId)}`);
  }

  // 点击文件(进入文件夹)、题目名称(打开习题详情)
  const clickLink = (row: QUESTION_BANK.QuestionBankRecord) => {
    if (row.elementType == 0) {
      // 题目跳转到详情
      window.open(`/question-bank/preview/courseId/exerciseId/${Number(params.courseId)}/${row.id}`)
    } else if (row.elementType == 1) {
      // 文件夹查询当前的列表
      setClickFile(() => [...clickFile, { label: row.exerciseName, value: row.id }])
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

  return (
    <div className='custom-single'>
      {/* <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
        <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
          <div className='header-logo'>
            <img src={logo} alt="" onClick={() => history.push('/')} />
          </div>
        </div>
      </div> */}

      <div className='question-bank'>
        <div className="title-4">题库</div>
        <div>
          <div className="flex question-tool">
            <div className="row-1">
              <div className='left'>
                <Button type="primary" onClick={() => { clickCreateQuestion() }}><SuperIcon type="icon-icon-edit-3" />创建题目</Button>
                {/* <Button style={{background: '#FDDF66'}}><SuperIcon type="icon-icon-import" />一键导入</Button> */}
                <Button onClick={() => addNewFile()}><SuperIcon type="icon-icon-folder" />新建文件夹</Button>
                <Button onClick={() => { window.open(`/scene/list/${params.courseId}`); }}><SuperIcon type="icon-icon-scene" />场景</Button>
              </div>
              <div className='right'>
                {/* <Button type="text"><SuperIcon type="icon-daochu" />导出全部</Button> */}

              </div>
            </div>
            <div className="row-2">
              <label>课程：<b>{course?.courseName}</b></label>
              <label>题型</label>
              <Select
                style={{ width: 220 }}
                placeholder='请选择题目类型'
                mode="multiple"
                value={checkList_q}
                dropdownRender={allSelectValue => (
                  <div style={{ padding: 10 }}>
                    <p><Checkbox indeterminate={indeterminate_q} onChange={onCheckAllChange_q} checked={checkAll_q}>全选</Checkbox></p>
                    <Checkbox.Group style={{ width: '100%' }} value={checkList_q}>
                      {
                        typeList.map((element) => {
                          return <p key={element.id}>
                            <Checkbox key={element.id} value={element.id} onChange={onCheckChange_q}>{element.name}</Checkbox>
                          </p>
                        })
                      }
                    </Checkbox.Group>
                  </div>
                )}
              >
                {
                  typeList.map((element) => {
                    return <Option key={element.id} value={element.id}>{element.name}</Option>
                  })
                }
              </Select>
              <Input placeholder="知识点" onChange={onChangeKnowLege} style={{ width: 130, marginRight: '20px' }} />
              <Input placeholder="题目名称" onChange={onChangeKeyWord} style={{ width: 130, marginRight: '20px' }} />
              <Button type="primary" onClick={() => { queryButtonClick() }}>筛选</Button>
            </div>
          </div>
        </div>
        <div className="question-tool">
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
              columns={columnsQuestion}
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
              elementType: 1,
              exerciseName: value,
              id: checkId != -1 ? checkId : ''
            }
            saveExerciseCatalogue(param).then((res) => {
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
  );
};
export default QuestionsHome;

