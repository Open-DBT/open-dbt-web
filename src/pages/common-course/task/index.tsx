import React, { useState, useEffect } from 'react'
import { Divider, Button, message, Modal, Select, Radio, Input, Pagination } from 'antd';
import type { RadioChangeEvent } from 'antd';
const { Search } = Input;
const { Option } = Select;
import type { PaginationProps } from 'antd';
import './index.less';
import { API } from '@/common/entity/typings';
import { TASK } from '@/common/entity/task';
import { api_getClassByLoginUser } from '@/services/teacher/clazz/sclass';
import { api_getHomeWork, delHomeWork } from '@/services/teacher/task/task';
import EditPublishModal from './components/publish/index';

interface IProps {
  courseId: number;
}
const CourseTask = (props: IProps) => {
  const courseId = props.courseId;  // 课程id
  const [status, setStatus] = useState(0);  // 单选框-作业状态
  const [clazzList, setClazzList] = useState<API.SclassListRecord[]>([]);//未结束的班级列表
  const [clazzId, setClazzId] = useState<string>('-1');//下拉框选中班级
  const [taskDataList, setTaskDataList] = useState<TASK.TaskList []>([]);//作业列表
  const [keyWord, setkeyWord] = useState<string>('');  // 作业搜索关键字
  const [editPublishModalVisible, handEditPublishModalVisible] = useState<boolean>(false);// 修改发布设置弹框
  const [checkId, setCheckId] = useState<number>(-1); //操作id
  const [total, setTotal] = useState<number>(0); // 列表总数
  const [currentPage, setCurrentPage] = useState<number>(1); // 当前页数

  useEffect(() => {
    // 获取下拉班级列表接口
    api_getClassByLoginUser(courseId).then((res) => {
      res.success && setClazzList(res.obj)
    })
  }, []);
  // 状态、所选班级、关键字搜索和页数的值变化时，调用查询列表方法
  useEffect(() => {
    window.scrollTo(0, 0)
    fetchData()
  }, [status, clazzId, keyWord, currentPage]);
  
  /**
   * 查询数据
   */
  const fetchData = () => {
    let data: TASK.TaskListParam = {
      pageNum: currentPage,
      pageSize: 10,
      param: {
        courseId: courseId,
        classId: clazzId,
        status: status,
        homeworkName: keyWord,
      }
    }
    data.param.classId == '-1' && delete data.param.classId;//全部班级，移除classId属性
    api_getHomeWork(data).then((res) => {
      if (res.success) {
        // 获取列表数据
        setTaskDataList(res.obj.list)
        // 获取总数，进行分页使用
        setTotal(res.obj.total)
      }
    })
  }

  /**
   * 单选框切换
   * @param e 
   */
  const onChangeStatus = (e: RadioChangeEvent) => {
    setStatus(e.target.value);
    setCurrentPage(1)
  };

  /**
   * 班级切换
   * @param value 
   */
  const handleChangeSelect = (value: string) => {
    setClazzId(value);
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
   * 跳转到作业库
   */
  const clickInToLibrary = () => {
    window.open(`/task-bank/list/${courseId}`);
  }
  /**
   * 添加作业
   */
  const clickAddTask = () => {
    window.open(`/task-bank/addTask/courseId/parentId/${courseId}/0`);
  }
  /**
   * 删除作业
   */
  const delLineData = (id: number) => {
    Modal.confirm({
      title: '删除确认框',
      content: '确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 调用删除接口
        delHomeWork(id).then((res) => {
          if (res.success) {
            message.success(res.message)
            fetchData()
          } else {
            message.error(res.message)
          }
        })
      },
    });

  }
  // 切换页数
  const onChangePage: PaginationProps['onChange'] = (page) => {
    setCurrentPage(page);
  };
  // 修改发布设置
  const editPublishSet = async (item:TASK.TaskList) => {
    await setCheckId(item.id);
    handEditPublishModalVisible(true)
  }
  // 点击批阅跳转
  const clickReviewInto = (item:TASK.TaskList) => {
    window.open(`/teacher/course/task/review/courseId/classId/homeworkId/${courseId}/${item.classId}/${item.id}`)
  }
  return (
    <>
      <div className='task-container'>
        <div className="title-4">作业列表</div>
        <div className="task-tool task-header">
          <Button type="primary" onClick={clickAddTask}>添加作业</Button>
          <Button style={{ background: '#FDDF66' }} onClick={clickInToLibrary}>作业库</Button>
          <div className='header-div'>
            <div>
              <Select value={clazzId} style={{ width: 120 }} onChange={handleChangeSelect} >
                <Option value='-1'>全部班级</Option>
                {
                  clazzList.map((item, index) => {
                    return <Option key={index+'clazzList'} value={item.id}>{item.className}</Option>
                  })
                }
              </Select>
              <span style={{ marginLeft: '40px' }}>状态：</span>
              <Radio.Group onChange={onChangeStatus} value={status}>
                <Radio value={0}>全部</Radio>
                <Radio value={1}>未开始</Radio>
                <Radio value={2}>进行中</Radio>
                <Radio value={3}>已结束</Radio>
              </Radio.Group>
            </div>

            <Search placeholder="作业搜索" onSearch={onSearch} style={{ width: 200 }} />
          </div>
        </div>
        <div className="task-tool">
          {
            taskDataList.length != 0 && taskDataList.map((item: TASK.TaskList, index: number) => {
              return <div className='taks-list-item' key={'taskData' + index}>
                <div className='task-list-item-title'>{item.modelName}</div>
                <div className='task-list-item-content'>
                  <div>
                    <div style={{ lineHeight: '36px' }}>
                      {item.className}
                    </div>
                    <div style={{ lineHeight: '36px' }}>
                      作答时间：  {item.startTime}  —   {item.endTime}
                    </div>

                  </div>
                  <div>
                    <Button type="text" className='content-edit' onClick={() => editPublishSet(item)}>修改发布设置</Button>
                    <Button type="text" className='content-edit' onClick={() => delLineData(item.id)}>删除</Button>
                  </div>
                  <div className='content-opertion'>
                    <span className='opertion-number'><span className='number-one'>{item.uncompleteNum}</span> / {item.totalNum}</span><span className='opertion-text'>待批</span>
                    <Button type="primary" onClick={() => clickReviewInto(item)}>批阅</Button>
                  </div>
                </div>
                <Divider />
              </div>
            })
          }
          <div style={{ textAlign: 'center' }}>
            <Pagination current={currentPage} onChange={onChangePage} total={total} />
          </div>
        </div>
      </div>
      {
        checkId != -1 &&
        <EditPublishModal
          onSubmit={() => {
            handEditPublishModalVisible(false)
            fetchData()
          }}
          onCancel={() => handEditPublishModalVisible(false)}
          visible={editPublishModalVisible}
          checkId={checkId}
        />
      }

    </>
  )
}

export default CourseTask