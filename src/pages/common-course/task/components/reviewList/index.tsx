import React, { useEffect, useState } from 'react'
import './index.less';
import { Table, Radio, Divider, Input, Modal, message } from 'antd';
const { Search } = Input
import type { ColumnsType } from 'antd/es/table';
import SuperIcon from "@/pages/components/icons";
import { getApprovalList, getApprovalCount, taskCallBack } from '@/services/teacher/task/task';
import type { RadioChangeEvent } from 'antd';
import { useParams } from 'umi'
import AddTimeModal from './addTimeModal';
import { TASK } from '@/common/entity/task';
import { API } from '@/common/entity/typings';
interface DataType {
  key: React.Key;
  name: string;
  person: string;
  time: string;
}
const TaskReview = (props: any) => {
  const params: any = useParams();
  const classId = Number(params.classId); // 班级id
  const homeworkId = Number(params.homeworkId); // 作业id
  const [ bolSubmitted, setBolSubmitted ] = useState(1);   // 是否已提交
  const [dataList, setdataList] = useState([]);   // 批阅列表数据
  const [allNum, setAllNum] = useState(-1);   // 总数
  const [sumbitNum, setSumbitNum] = useState(-1);   // 已提交个数
  const [unsumbitNum, setUnSumbitNum] = useState(-1);   // 未提交个数
  const [homeWorkName, setHomeWorkName] = useState('');   // 作业名称
  const [className, setClassName] = useState('');   // 班级名称
  const [bolTimeAdd, setBolTimeAdd] = useState<boolean>(false);   // 加时弹框
  const [checkRow, setCheckRow] = useState();   // 选中行数据
  const [keyWord, setkeyWord] = useState<string>('');  // 关键字
  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'studentName',
    },
    {
      title: '学号/工号',
      align: 'center',
      dataIndex: 'studentCode',
    },
    {
      title: '提交时间',
      align: 'center',
      dataIndex: 'submitTime',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'checkStatus',
      render: (_, record) => {
        return _==1?'已批阅':'待批阅';
      }
    },
    {
      title: '批阅人',
      align: 'center',
      dataIndex: 'approvalUser',
    },
    {
      title: '成绩',
      align: 'center',
      dataIndex: 'score',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (_, record: { key: React.Key }) =>
      (
        <>     
          <a style={{ marginRight: '10px' }} onClick={()=>handleView(record)}>查看</a>
          <a style={{ marginRight: '10px' }} onClick={()=>handleReview(record)}>批阅</a>
          <a style={{ marginRight: '10px' }} onClick={()=>handleExit(record)}>打回</a>
        </>
      ),
    },
  ];
  // 未提交列表
  const waitColumns: ColumnsType<DataType> = [
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'studentName',
    },
    {
      title: '学号/工号',
      align: 'center',
      dataIndex: 'studentCode',
    },
    {
      title: '成绩',
      align: 'center',
      dataIndex: 'score',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (item, record:any) => <a style={{ marginRight: '10px' }} onClick={()=>{setCheckRow(record); setBolTimeAdd(true)}}>加时</a>
    },
  ];
  useEffect(() => {
    window.onstorage = function (e) {
        localStorage.removeItem("refresh-task-review")
        getListData()
        getApprovalCountData()
    };
}, [])
  // 根据关键字和是否修改已提交按钮来重新渲染列表
  useEffect(() => {
    getListData()
    getApprovalCountData()
  }, [bolSubmitted, keyWord])
  // 查询批阅列表
  const getListData = () => {
    let valueParam = {
      orderBy: "score desc",
      pageNum: 1,
      pageSize: 10,
      param: {
        homeworkStatus: bolSubmitted,
        homeworkId: homeworkId,
        classId: classId,
        studentName: keyWord,
      }
    }
    getApprovalList(valueParam).then((res:any) => {
      if (res.success) {
        setdataList(res.obj.list)
      }
    })

  }
  // 获得该作业的信息和子列表相关的数量
  const getApprovalCountData = () => {
    let param = {
      homeworkStatus: bolSubmitted,
      homeworkId: homeworkId,
      classId: classId,
      studentName: ''
    }
    getApprovalCount(param).then((res: API.Result<TASK.TaskReviewCount>) => {
      if (res.success) {
        setHomeWorkName(res.obj.homeworkName)
        setClassName(res.obj.className)
        setAllNum(res.obj.totalNum)
        setSumbitNum(res.obj.submitNum)
        setUnSumbitNum(res.obj.unsubmitNum)
      }
    })
  }
  // 打开查看新窗口
  const handleView = (row:any) => {
    window.open(`/task-bank/task/detail/studentId/homeworkId/${row.studentId}/${row.homeworkId}`)
  }
  // 打开批阅新窗口
  const handleReview = (row:any) => {
    window.open(`/task-bank/task/review/studentId/homeworkId/${row.studentId}/${row.homeworkId}`)
  }
  // 选择已交还是未交，修改值
  const onChangeRadio = (e: RadioChangeEvent) => {
    setBolSubmitted(e.target.value);
  };
  // 点击打回按钮触发弹框
  const handleExit = (row:any) => {
    Modal.confirm({
      title: '打回',
      content: '确定要打回重做吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        handleCallBack(row)
      },
      onCancel() {},
    });
  }
  const handleCallBack = (row:any) => {
    taskCallBack(row.homeworkId, row.studentId).then((res:any) => {
      if (res.success) {
        message.success(res.message)
        getListData()

      }else {
        message.error(res.message)
      }
    })
  }
  /**
 * 关键字搜索
 * @param value 
 * @returns 
 */
  const onSearch = (value: string) => {
    setkeyWord(value.trim())
  }
  return (
    <>
      <div className="task-tool">
        <div>
          <div className='title-4'>
            {homeWorkName}
          </div>
          <div className='header-div'>
            <div>
              <SuperIcon type="icon-icon-class-name1" style={{ fontSize: '1.5rem' }} />
              <span style={{ marginLeft: '10px' }}>{className}</span>
            </div>

            <Search placeholder="请输入姓名" onSearch={onSearch} style={{ width: 300 }} />
          </div>
          <Divider></Divider>
          <div className='review-tool-header'>
            <div>
              <Radio.Group onChange={onChangeRadio} value={bolSubmitted}>
                <Radio value={1}>已交</Radio>
                <Radio value={2}>未交</Radio>
              </Radio.Group>
            </div>
            <div>
              共 {allNum} 名学生，已交 {sumbitNum}，未交 {unsumbitNum}
            </div>
          </div>
          <Table
            columns={bolSubmitted==1?columns:waitColumns}
            dataSource={dataList}
            rowKey="studentCode"
          />
        </div>
      </div>
      {
        bolTimeAdd && checkRow &&
        <AddTimeModal
        onSubmit={() => {
          setBolTimeAdd(false);
          getListData()

        }}
        onCancel={() => setBolTimeAdd(false)}
        visible={bolTimeAdd}
        checkRow={checkRow}
      />
      }
    </>
  )
}

export default TaskReview