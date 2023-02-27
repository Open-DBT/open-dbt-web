import React, { useRef, useState, useEffect } from 'react';
import { Card, Tabs, message, Button, Select } from 'antd';
import { getStudentCorrect, getStudentCoverage } from '@/services/student/progress'
import { getStuBySclassAndCode } from '@/services/system/user'
import { getClass } from '@/services/teacher/clazz/sclass';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
const { Option } = Select;
import { API } from '@/common/entity/typings';

const SclassStat: React.FC<{}> = () => {
  const [sclassId, setSclassId] = useState<number>(-1);//选中班级id
  const [sclassList, setSclassList] = useState<API.SclassListRecord[]>([]);//班级列表
  const [stuCode, setStuCode] = useState<string>('');//输入学号
  const [userId, setUserId] = useState<number>(-1)

  useEffect(() => {
    getClass().then((result) => {
      if (result.obj) setSclassList(result.obj)
    })
  }, []);

  const handleStat = () => {
    console.log('sclassId', sclassId, stuCode)
    if (sclassId === -1) {
      message.info('请选择班级');
      return
    }
    if (stuCode.trim().length === 0) {
      message.info('请录入学号');
      return
    }
    const param = { sclassId: sclassId, code: stuCode.trim() };
    getStuBySclassAndCode(param).then((result: any) => {
      console.log('result', result)
      //异常错误，跳出
      if (!result.obj) return;
      const stuList = result.obj;
      if (stuList.length === 0) {
        //查无此人，跳出
        message.info(`未找到学号：<${stuCode}>的学生`)
        return;
      } else {
        setUserId(stuList[0].userId)
        actionRefTab1.current?.reload();
        actionRefTab2.current?.reload();
      }
    })
  }
  const actionRefTab1 = useRef<ActionType>();
  const actionRefTab2 = useRef<ActionType>();
  const columnsTab1: ProColumns<API.SclassCorrect>[] = [
    {
      title: '习题编号',
      dataIndex: 'id',
      align: 'center',
      width: '100px',
    },
    {
      title: '习题名称',
      dataIndex: 'exerciseName',
      align: 'center',
    },
    {
      title: '(我)答对次数',
      dataIndex: 'correctCount',
      align: 'center',
      width: '100px',
    },
    {
      title: '(我)答题次数',
      dataIndex: 'answerCount',
      align: 'center',
      width: '100px',
    },
    {
      title: '全班答对人数',
      dataIndex: 'allCorrectCount',
      align: 'center',
      width: '100px',
    },
    {
      title: '全班答题次数',
      dataIndex: 'allAnswerCount',
      align: 'center',
      width: '100px',
    },
    {
      title: '全班学生',
      dataIndex: 'stuCount',
      align: 'center',
      width: '100px',
    }
  ];
  const columnsTab2: ProColumns<API.StudentCoverage>[] = [
    {
      title: '学号',
      dataIndex: 'code',
      align: 'center',
      width: '150px',
    },
    {
      title: '学生姓名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '(我)答对题数量',
      dataIndex: 'correctCount',
      align: 'center',
      width: '120px',
    },
    {
      title: '(我)答题总数',
      dataIndex: 'answerCount',
      align: 'center',
      width: '120px',
    },
    {
      title: '总题目数',
      dataIndex: 'exerciseCount',
      align: 'center',
      width: '100px',
    },
    {
      title: '本班答对平均值',
      dataIndex: 'avgCorrectCount',
      align: 'center',
      width: '120px',
    },
    {
      title: '本班答题总数平均值',
      dataIndex: 'avgAnswerCount',
      align: 'center',
      width: '150px',
    }
  ];
  return (
    <>
      <Card
        style={{ marginBottom: 10 }}
        bordered={false}
        bodyStyle={{ padding: '15px 20px 15px 20px' }}
      >
        班级名称：<Select style={{ width: 200, marginRight: 20 }} onChange={(value: number) => setSclassId(value)}>
          {
            sclassList.map((item, index) => {
              return <Option key={index} value={item.id}>{item.className}</Option>
            })
          }
        </Select>
        学号：<input style={{ width: 200, marginRight: 20 }} onChange={(v) => setStuCode(v.target.value)} />
        <Button type="primary" onClick={() => handleStat()}>查询</Button>
      </Card>

      <Card
        style={{ marginBottom: 10 }}
        bordered={false}
        bodyStyle={{ padding: '10px 20px 10px 20px' }}
      >
        <Tabs defaultActiveKey="1" type="card"
          items={[
            {
              key: "1",
              label: '正确率',
              children:
                <ProTable style={{ width: '80%' }}
                  actionRef={actionRefTab1}
                  rowKey="id"
                  pagination={false}
                  request={(params, sorter, filter) => {
                    console.log(params, sorter, filter);
                    return getStudentCorrect(sclassId, userId)
                  }}
                  columns={columnsTab1}
                  search={false}
                  toolBarRender={false}
                />
            }, {
              key: "2",
              label: '覆盖率',
              children:
                <ProTable style={{ width: '80%' }}
                  actionRef={actionRefTab2}
                  rowKey="id"
                  pagination={false}
                  request={(params, sorter, filter) => {
                    console.log(params, sorter, filter);
                    return getStudentCoverage(sclassId, userId)
                  }}
                  columns={columnsTab2}
                  search={false}
                  toolBarRender={false}
                />
            }
          ]}
        />
      </Card>
    </>
  );
};

export default SclassStat;
