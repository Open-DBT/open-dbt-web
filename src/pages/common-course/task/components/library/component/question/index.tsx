import React, { useEffect, useState } from 'react';
import logo from '@/img/logo-itol.png'
import { Table, Button, message, Breadcrumb, Select, Input, Checkbox, TablePaginationConfig } from 'antd';
import SuperIcon from "@/pages/components/icons";
import { getCourseDetail } from '@/services/teacher/course/course';
import { completedSelectedExercises, getHomeWorkModelExercises } from '@/services/teacher/task/task';
import './index.less';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
const { Option } = Select;
import { QUESTION_BANK } from '@/common/entity/questionbank';
import CODE_CONSTANT from '@/common/code'
import { API } from '@/common/entity/typings';
import { history, useParams, useLocation } from 'umi';
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
  const location: any = useLocation();
  const courseId = params.courseId;
  const taskParentId = params.parentId;
  const [course, setCourse] = useState<API.CourseListItem | undefined>(undefined); //课程
  const [data, setData] = useState<{ count: number, list: any[] }>({ count: 0, list: [] });
  const [checkList_q, setCheckList_q] = useState<number[]>(typeList.map((item) => item.id)); //题库选择器，默认值全选
  const [indeterminate_q, setIndeterminate_q] = useState(true);//题库全选style控制
  const [checkAll_q, setCheckAll_q] = useState(false);//题库全选，数据记录
  const [clickFile, setClickFile] = useState<{ label: string, value: number }[]>([{ label: '全部题目', value: 0 }]);
  const [keyWord, setkeyWord] = useState<string>('');  // 关键字
  const [knowledge, setknowledge] = useState<string>('');  // 知识点关键字
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defPage,
    parentId: 0,//目录父级id
  });
  const [order, setOrder] = useState<string>('');  // 排序关键字
  const [selectNum, setSelectNum] = useState<number>(0);  // 选择题目个数
  const [selectTypeNum, setSelectTypeNum] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);  // 选择题目个数
  const taskName = location.state?.taskName
  const questionType = location.state?.questionType
  const modelId = location.state?.modelId;
  let checkedList: any[] = []
  useEffect(() => {
    //非空校验
    // ValidateIntegerParam(courseId);
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
      modelId: modelId ? modelId : '',
      parentId: tableParams.parentId,
      courseIdList: [courseId],
      exerciseName: keyWord,
      exerciseTypeList: exerciseTypeList,
      knowledge: knowledge,
    }
    getHomeWorkModelExercises(getRandomuserParams({ ...tableParams, param, orderBy: order })).then((res) => {
      setData({ count: res.count, list: res.list })
      checkedList = res.list.filter((item) => item.checked == 1)
      console.log("checkedList:", checkedList)
      let arr: any[] = [];
      checkedList.map((item) => {
        arr.push(item.id + '-' + item.exerciseType)
      })
      setSelectedRowKeys(arr);
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

  const columnsSelectQuestion: ColumnsType<QUESTION_BANK.QuestionBankRecord> = [
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
  const onSelectChange = (newSelectedRowKeys: any[], selectedRows: any) => {
    // 对应题目类型个数和总数
    setSelectNum(newSelectedRowKeys.length)
    console.log('selectedRowKeys changed: ', newSelectedRowKeys, 'selectedRows:', selectedRows);

    if (selectedRows.length != 0) {
      let numArr = [0, 0, 0, 0, 0, 0]
      selectedRows.map((item: any) => {
        item.exerciseType == 1 && numArr[0]++;
        item.exerciseType == 2 && numArr[1]++;
        item.exerciseType == 3 && numArr[2]++;
        item.exerciseType == 4 && numArr[3]++;
        item.exerciseType == 5 && numArr[4]++;
        item.exerciseType == 6 && numArr[5]++;
      })
      setSelectTypeNum(numArr)
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: onSelectChange,
    getCheckboxProps: (record: any) => ({
      disabled: record.elementType === 1 || record.checked == 1, // Column configuration not to be checked
    }),
  };
  /**
   * 完成选题
   */
  const finishSelectQuestion = () => {
    let param = {
      authType: 2,
      parentId: Number(taskParentId),
      modelName: taskName,
      classify: questionType,
      courseId: courseId,
      modelId: modelId ? modelId : '',
      modelExerciseDTOS: getSelectQuestionData(),
    }
    completedSelectedExercises(param).then((res) => {
      if (res.success) {
        history.push({ pathname: `/task-bank/addTask/courseId/parentId/${courseId}/${taskParentId}`, state: { modelId: res.obj.id } })
      }
    })
  }
  /**
   * 获取接口需要的选择题库的数据
   */
  const getSelectQuestionData = () => {
    let arr: any[] = []
    selectedRowKeys.length != 0 && selectedRowKeys.map((item, index) => {
      let itemArr = item.split('-')
      let obj = {
        exerciseId: -1,
        exerciseType: -1
      }

      obj.exerciseId = itemArr[0]
      obj.exerciseType = itemArr[1]
      // if (checkedList.length != 0) {
      //   checkedList.map((item) => {
      //     if (obj.exerciseId != item.id) arr.push(obj)
      //   })
      // } else arr.push(obj)
      arr.push(obj)
    })
    console.log(arr)
    return arr
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

      <div className='main-container question-bank'>

        <div className="title-4">题库</div>
        <div>
          <div className="flex question-tool">
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
              columns={columnsSelectQuestion}
              rowSelection={rowSelection}
              rowKey={record => record.id + '-' + record.exerciseType}
              dataSource={data.list}
              pagination={tableParams.pagination}
              // loading={loading}
              onChange={handleTableChange}
            />
          }
        </div>
      </div>
      <div className='custom-header-row' style={{ position: 'fixed', bottom: 0 }}>
        <div className='custom-header-row flex-header-row' style={{ position: 'fixed', bottom: 0 }}>
          <div className='header-left-bottom'>
            <span className='question-num'>已选 {selectNum} 题</span>
            <span className='type-desc'>
              （
              {
                selectTypeNum[0] != 0 ? selectTypeNum[0] + "单选题 " : ''
              }
              {
                selectTypeNum[1] != 0 ? selectTypeNum[1] + "多选题 " : ''
              }
              {
                selectTypeNum[2] != 0 ? selectTypeNum[2] + "判断题 " : ''
              }
              {
                selectTypeNum[3] != 0 ? selectTypeNum[3] + "填空题 " : ''
              }
              {
                selectTypeNum[4] != 0 ? selectTypeNum[4] + "简答题 " : ''
              }
              {
                selectTypeNum[5] != 0 ? selectTypeNum[5] + "SQL编程题 " : ''
              }
              ）
            </span>
          </div>
          <div className='header-right'>
            <Button style={{ borderRadius: '5px', marginRight: '20px' }} onClick={() => { history.go(-1) }}>
              取消选题
            </Button>
            <Button type="primary" style={{ borderRadius: '5px' }} onClick={() => { finishSelectQuestion() }}>
              完成选题
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};
export default QuestionsHome;

