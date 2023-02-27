import React, { useRef, useState, useEffect } from 'react';
import { Card, message, Button, Select, Tabs } from 'antd';
import { getClass, getStuAnswerSituation } from '@/services/teacher/clazz/sclass';
import { getSclassCorrect, getSclassCoverage } from '@/services/student/progress'
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import StuAnswerSituationModal from './StuAnswerSituationModal'
const { Option } = Select;
import { API } from '@/common/entity/typings';
const SclassStat: React.FC<{}> = () => {
  const [sclassId, setSclassId] = useState<number>(-1);//新建
  const [sclassList, setSclassList] = useState<API.SclassListRecord[]>([]);//新建

  useEffect(() => {
    getClass().then((result) => {
      if (result.obj) setSclassList(result.obj)
    })
  }, []);

  const handleStat = () => {
    console.log('sclassId', sclassId)
    if (sclassId == -1) {
      message.info('请选择统计班级');
      return
    }
    actionRefTab1.current?.reload();
    actionRefTab2.current?.reload();
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
      title: '答对人数',
      dataIndex: 'correctCount',
      align: 'center',
      width: '100px',
    },
    {
      title: '已回答人数',
      dataIndex: 'answerCount',
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
  const columnsTab2: ProColumns<API.SclassCoverage>[] = [
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
      title: '答对题数量',
      dataIndex: 'correctCount',
      align: 'center',
      width: '100px',
    },
    {
      title: '答题数量',
      dataIndex: 'answerCount',
      align: 'center',
      width: '100px',
    },
    {
      title: '提交次数',
      dataIndex: 'submitAnswerCount',
      align: 'center',
      width: '100px',
      render: (_, record) => {
        if (record.submitAnswerCount > 0) {
          return <a key='2' onClick={() => { openStuAnswerSituationModal(record) }}>{record.submitAnswerCount}</a>;
        } else {
          return 0;
        }
      }
    },
    {
      title: '总题目数',
      dataIndex: 'exerciseCount',
      align: 'center',
      width: '100px',
    }
  ];

  const [modalVisible, setModalVisible] = useState<boolean>();
  const [stuName, setStuName] = useState<string>();
  const [stuCode, setStuCode] = useState<string>();
  const [dataSource, setDataSource] = useState<API.Score[]>([]);

  const openStuAnswerSituationModal = (record: API.SclassCoverage) => {
    getStuAnswerSituation(sclassId, record.id).then((result) => {
      if (result.success) {
        setDataSource(result.obj);
        setStuName(record.userName);
        setStuCode(record.code);
        setModalVisible(true);
      } else {
        message.error(result.message);
      }
    })
  }

  return (
    <>
      <Card
        style={{ marginBottom: 10 }}
        bordered={false}
        bodyStyle={{ padding: '15px 20px 15px 20px' }}
      >
        <div>
          班级名称：<Select style={{ width: 200, marginRight: 20 }} onChange={(value: number) => setSclassId(value)}>
            {
              sclassList.map((item, index) => {
                return <Option key={index} value={item.id}>{item.className}</Option>
              })
            }
          </Select>
          <Button type="primary" onClick={() => handleStat()}>查询</Button>
        </div>
      </Card>

      <Card
        bordered={false}
        bodyStyle={{ padding: '15px 20px 5px 20px' }}
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
                    return getSclassCorrect(sclassId)
                  }}
                  columns={columnsTab1}
                  search={false}
                  toolBarRender={false}
                />
            }, {
              key: "2",
              label: '覆盖率',
              children:
                <ProTable style={{ width: '60%' }}
                  actionRef={actionRefTab2}
                  rowKey="id"
                  pagination={false}
                  request={(params, sorter, filter) => {
                    return getSclassCoverage(sclassId, 0, '0')
                  }}
                  columns={columnsTab2}
                  search={false}
                  toolBarRender={false}
                />
            }
          ]}
        />
      </Card>

      <StuAnswerSituationModal
        onCancel={() => {
          setModalVisible(false);
        }}
        modalVisible={modalVisible!}
        stuName={stuName!}
        stuCode={stuCode!}
        dataSource={dataSource}
      />
    </>
  );
};

export default SclassStat;
