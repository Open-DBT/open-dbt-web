import { useEffect, useState } from 'react';
import logo from '@/img/logo-itol.png'
import { Table, Button, message, Select, Input, Checkbox, PaginationProps, TablePaginationConfig } from 'antd';
import SuperIcon from "@/pages/components/icons";
const { Search } = Input;
import { getMyCourseList } from '@/services/teacher/course/course';
import { useParams } from 'umi'
import { api_getExercise } from '@/services/teacher/course/question-bank';
import './index.less';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ColumnsType, FilterValue, SorterResult, SortOrder, TableCurrentDataSource } from 'antd/lib/table/interface';
const { Option } = Select;
import { QUESTION_BANK } from '@/common/entity/questionbank'
import { API } from '@/common/entity/typings';


interface TableParams {
  pagination: TablePaginationConfig;
  // sortField?: string;
  // sortOrder?: string;
  filters?: Record<string, FilterValue>;

  order?: SortOrder
  field?: string
  // columnKey?: string
}

const columns: ColumnsType<QUESTION_BANK.QuestionBankRecord> = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
  },
  {
    title: '文件夹/题目',
    dataIndex: 'exerciseName',
    key: 'exerciseName',
    sorter: true,
  },
  {
    title: '题型',
    dataIndex: 'exerciseType',
    key: 'exerciseType',
  },
  {
    title: '难度',
    dataIndex: 'exerciseLevel',
    key: 'exerciseLevel',
  },
  {
    title: '创建人',
    dataIndex: 'create_user',
    key: 'create_user',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
];
//题目类型
const typeList = [
  { id: 1, name: '单选题' },
  { id: 2, name: '多选题' },
  { id: 3, name: '判断题' },
  { id: 4, name: '填空题' },
  { id: 5, name: '简答题' },
  { id: 6, name: 'SQL编程题' },
]

/**
 * 题库
 * @param props 
 * @returns 
 */
const QuestionsHome = (props: any) => {
  // const courseId = props.match.params.courseId;
  const params: any = useParams();

  const [courseList, setCourseList] = useState<API.CourseListItem[]>([]); //课程列表
  const [checkListCourse, setCheckListCourse] = useState<number[]>([]); //课程选择器，默认值是当前课程
  const [indeterminateCourse, setIndeterminateCourse] = useState(true);//课程全选style记录
  const [checkAllCourse, setCheckAllCourse] = useState(false);//课程全选，数据记录

  const [checkList_q, setCheckList_q] = useState<number[]>([]); //题库选择器，默认值全选
  const [indeterminate_q, setIndeterminate_q] = useState(true);//题库全选style控制
  const [checkAll_q, setCheckAll_q] = useState(false);//题库全选，数据记录

  const [data, setData] = useState<QUESTION_BANK.QuestionBankRecord[]>([]);//表格数据
  // const [paging, setPaging] = useState<Page>({ current: 1, pageSize: 2, total: 0 });
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 2,
    },
  });

  useEffect(() => {
    //查询课程，设置默认值
    getMyCourseList().then((result) => {
      if (result.success) {
        setCourseList(result.obj);
        //验证参数courseId是否正确
        try {
          const courseId = Number(params.courseId);
          result.obj.findIndex((item) => item.courseId == courseId) > -1 && setCheckListCourse([courseId]);
        } catch (error) { }
      }
    });
    //设置题库默认值，全选
    setCheckList_q(typeList.map((item) => item.id))

    // queryData();
  }, []);

  /**
   * checkbox课程的钩子
   */
  useEffect(() => {
    setIndeterminateCourse(!!courseList.length && courseList.length < checkListCourse.length);
    setCheckAllCourse(checkListCourse.length === courseList.length);
  }, [checkListCourse]);

  /**
   * 课程checkbox全选事件
   * @param e 
   */
  const onCheckAllChangeC = (e: CheckboxChangeEvent) => {
    setCheckListCourse(e.target.checked ? courseList.map((e) => e.courseId) as number[] : []);
    setIndeterminateCourse(false);
    setCheckAllCourse(e.target.checked);
  };
  /**
   * 课程checkbox勾选事件
   * @param e 
   */
  const onCheckChangeC = (e: CheckboxChangeEvent) => {
    //查找数组中是否包含本选项
    const index = checkListCourse.findIndex((item) => item == e.target.value);
    //勾选，数组添加元素
    e.target.checked && index == -1 && setCheckListCourse([...checkListCourse, e.target.value]);
    //取消勾选，数组移除元素
    !e.target.checked && index > -1 && setCheckListCourse(checkListCourse.filter((item) => item != e.target.value));
  };

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
   * 关键字搜索
   * @param value 
   * @returns 
   */
  const onSearch = (value: string) => {
    console.log(value);
  }
  const queryData = () => {
    let fieldOrder = '';
    if (tableParams.order) {
      const order = tableParams.order === 'ascend' ? 'asc' : 'desc';
      fieldOrder = tableParams.field + ' ' + order;
    }
    api_getExercise(tableParams.pagination.current!, tableParams.pagination.pageSize!, fieldOrder).then((resp) => {
      console.log('api_getExercise', 11111111)
      setData(resp.data);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          // total: 200,
        },
      });
    })
  }

  useEffect(() => {
    queryData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: SorterResult<QUESTION_BANK.QuestionBankRecord>,
    extra: any
  ) => {
    console.log('pagination', pagination);
    console.log('sorter', sorter);
    setTableParams({
      pagination,
      order: sorter.order,
      field: sorter.field as string
    });
    // queryData();
  };

  return (
    <>
      <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
        <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
          <div className='header-logo'>
            <img src={logo} alt="" />
          </div>
        </div>
      </div>

      <div className='question-bank'>
        <div className='content'>
          <div className="title-4">题库</div>
          <div>
            <div className="flex question-tool">
              <div className="row-1">
                <div className='left'>
                  <Button type="primary"><SuperIcon type="icon-icon-edit-3" />创建题目</Button>
                  {/* <Button type="primary"><SuperIcon type="icon-icon-edit-3" />一键导入</Button> */}
                  <Button ><SuperIcon type="icon-icon-edit-3" />新建文件夹</Button>
                </div>
                <div className='right'>
                  <Button><SuperIcon type="icon-icon-edit-3" />导出全部</Button>
                  <Search placeholder="关键词搜索" onSearch={onSearch} style={{ width: 200 }} />
                </div>
              </div>
              <div className="row-2">
                <label>课程</label>
                <Select
                  style={{ width: 220 }}
                  placeholder='请选择课程'
                  mode="multiple"
                  showArrow={true}
                  value={checkListCourse}
                  dropdownRender={allSelectValue => (
                    <div style={{ padding: 10 }}>
                      <p><Checkbox indeterminate={indeterminateCourse} onChange={onCheckAllChangeC} checked={checkAllCourse}>全选</Checkbox></p>
                      <Checkbox.Group style={{ width: '100%' }} value={checkListCourse}>
                        {
                          courseList.map((element) => {
                            return <p key={element.courseId}>
                              <Checkbox key={element.courseId} value={element.courseId} onChange={onCheckChangeC}>{element.courseName}</Checkbox>
                            </p>
                          })
                        }
                      </Checkbox.Group>
                    </div>
                  )}
                >
                  {
                    courseList.map((element) => {
                      return <Option key={element.courseId} value={element.courseId}>{element.courseName}</Option>
                    })
                  }
                </Select>
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
                <Button type="primary">筛选</Button>
              </div>
            </div>
          </div>
          <Table
            dataSource={data}
            columns={columns}
            // pagination={{
            //   ...paging,
            //   onChange: onShowSizeChange
            // }}
            pagination={tableParams.pagination}
            // onChange={onChange1}
            rowKey="id"
            onChange={handleTableChange}
          />
        </div>
      </div>
    </>
  );
};
export default QuestionsHome;

