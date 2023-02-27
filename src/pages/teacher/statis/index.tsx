import { useEffect, useState } from 'react';
import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
import './index.less';
import { getStuAnswerSituation } from '@/services/teacher/clazz/sclass';
import { Tabs, message, Space, Button, Progress, Input } from 'antd';
import { getSclassCorrect, getSclassCoverage, exportStatisticsInfo } from '@/services/student/progress';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import StuAnswerSituationModal from './StuAnswerSituationModal';
import * as APP from '@/app';
import { API } from '@/common/entity/typings';
const ClassIndex = (props: any) => {

  const sclassId = props.sclassId;

  const [sclassCoverage, setSclassCoverage] = useState<API.SclassCoverage[]>();
  const [isFuzzyQuery, setIsFuzzyQuery] = useState<number>(0);

  useEffect(() => {
    getSclassCoverage(sclassId, 0, '0').then((data) => {
      if (data!.data) {
        setSclassCoverage(data!.data);
      }
    })
  }, []);

  const columnsTab1: ProColumns<API.SclassCorrect>[] = [
    {
      title: '题目',
      dataIndex: 'exerciseName',
      render: (dom, record, index, action) => {
        let className = 'exercise-id';
        if (record.correctCount === 0) className += ' zero-background-color'
        return <Space size="middle">
          <div className={className}>#{record.id}</div>
          {record.exerciseName}
        </Space>;
      },
    },
    {
      title: '答对人数',
      dataIndex: 'correctCount',
      align: 'center',
      width: '120px',
      sorter: (a, b) => {
        return a.correctCount - b.correctCount
      },
      render: (dom, record, index, action) => {
        return <span className={record.correctCount === 0 ? 'zero-font-color' : ''}>{record.correctCount}</span>;
      },
    },
    {
      title: '已答题人数',
      dataIndex: 'answerCount',
      align: 'center',
      width: '120px',
      sorter: (a, b) => {
        return a.answerCount - b.answerCount
      },
    },
    {
      title: '全班人数',
      dataIndex: 'stuCount',
      align: 'center',
      width: '120px',
    }
  ];

  const columnsTab2: ProColumns<API.SclassCoverage>[] = [
    {
      title: '学号',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '进度',
      align: 'center',
      width: '250px',
      render: (_, record) => {
        if (record.exerciseCount === 0) {
          return <Progress percent={100} size="small" style={{ width: '80%', marginLeft: 14 }} />
        } else {
          return <Progress percent={parseInt((record.answerCount / record.exerciseCount) * 100)} size="small" style={{ width: '80%', marginLeft: 14 }} />
        }
      },
      sorter: (a, b) => {
        const progress1 = a.exerciseCount === 0 ? 100 : parseInt((a.answerCount / a.exerciseCount) * 100);
        const progress2 = b.exerciseCount === 0 ? 100 : parseInt((b.answerCount / b.exerciseCount) * 100);
        return progress1 - progress2
      },
    },
    {
      title: '答对题数量',
      dataIndex: 'correctCount',
      align: 'center',
      width: '150px',
      sorter: (a, b) => {
        return a.correctCount - b.correctCount
      },
    },
    {
      title: '答题数量',
      dataIndex: 'answerCount',
      align: 'center',
      width: '150px',
      sorter: (a, b) => {
        return a.answerCount - b.answerCount
      },
    },
    {
      title: () => {
        return <span>提交次数<p className="stu-coverage-table-head-p">(点击次数查看详情)</p></span>
      },
      dataIndex: 'submitAnswerCount',
      align: 'center',
      width: '150px',
      render: (_, record) => {
        if (record.submitAnswerCount > 0) {
          return <a key='2' onClick={() => { openStuAnswerSituationModal(record) }}>{record.submitAnswerCount}</a>;
        } else {
          return 0;
        }
      },
      sorter: (a, b) => {
        return a.submitAnswerCount - b.submitAnswerCount
      },
    },
    {
      title: '总题目数',
      dataIndex: 'exerciseCount',
      align: 'center',
      width: '120px',
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

  const [showPage, setShowPage] = useState<string>('1');

  const tabOnChange = (activeKey: string) => {
    setShowPage(activeKey);

    if (activeKey === '1') {
      setIsFuzzyQuery(0);
      setSearchValue('');
    }

    if (showPage != activeKey && activeKey === '2' && isFuzzyQuery == 0 && searchValue.trim() == '') {
      getSclassCoverage(sclassId, 0, '0').then((data) => {
        if (data!.data) {
          setSclassCoverage(data!.data);
        }
      })
    }
  }

  const exportInfo = () => {
    let isFuzzy = isFuzzyQuery;
    if (isFuzzyQuery == 1 && searchValue.trim() == '') {
      isFuzzy = 0;
    }

    let value = '0'
    if (isFuzzyQuery == 1 && searchValue.trim() != '') {
      value = searchValue.trim();
    }
    exportStatisticsInfo(sclassId, showPage, isFuzzy, value).then((data) => {
      if (data.success) {
        const link = document.createElement('a');
        const evt = document.createEvent('MouseEvents');
        link.style.display = 'none';
        link.href = `${APP.request.prefix}/temp/${data.obj}`;
        link.download = data.obj;
        document.body.appendChild(link); // 此写法兼容可火狐浏览器
        evt.initEvent('click', false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);// 下载完成移除元素
        window.URL.revokeObjectURL(link.href); // 释放掉blob对象
      } else {
        message.error(data.message);
      }
    })
  }

  const operations = showPage === '2' ?
    <div className="flex">
      <Input placeholder="搜索学生姓名或学号" style={{ width: '230px' }} onChange={(e: any) => changeSearchValue(e.target.value)} />
      <Button type="primary" style={{ borderRadius: '4px', marginLeft: '10px' }} onClick={() => fuzzyQuery()}>查询</Button>
    </div> : null

  const [searchValue, setSearchValue] = useState<string>('');
  const changeSearchValue = (value: string) => {
    setIsFuzzyQuery(1);
    setSearchValue(value);
  }

  const fuzzyQuery = () => {
    let isFuzzy = isFuzzyQuery;
    if (isFuzzyQuery == 1 && searchValue.trim() == '') {
      isFuzzy = 0;
    }

    let value = '0'
    if (isFuzzyQuery == 1 && searchValue.trim() != '') {
      value = searchValue.trim();
    }
    getSclassCoverage(sclassId, isFuzzy, value).then((data) => {
      if (data!.data) {
        setSclassCoverage(data!.data);
      }
    })
  }

  return (
    <div className="sclass-statis-div">
      <div className="title-4 title-div">
        统计
        <Button type="primary" onClick={() => exportInfo()}>
          导出
        </Button>
      </div>
      <Tabs defaultActiveKey="1" onChange={tabOnChange} tabBarExtraContent={operations}
        items={[
          {
            key: "1",
            label: '班级情况',
            children:

              <ProTable
                rowKey="id"
                pagination={false}
                rowClassName={record => {
                  if (record.correctCount === 0) {
                    return 'table-row-color-zero';
                  }
                }}
                request={(params, sorter, filter) => {
                  return getSclassCorrect(sclassId);
                }}
                columns={columnsTab1}
                search={false}
                toolBarRender={false}
              />
          }, {
            key: "2",
            label: '学生情况',
            children:
              <ProTable
                rowKey="id"
                pagination={false}
                dataSource={sclassCoverage}
                columns={columnsTab2}
                search={false}
                toolBarRender={false}
              />
          }
        ]}
      />

      <StuAnswerSituationModal
        onCancel={() => {
          setModalVisible(false);
        }}
        modalVisible={modalVisible!}
        sclassId={sclassId}
        stuName={stuName!}
        stuCode={stuCode!}
        dataSource={dataSource}
      />
    </div>
  );
};

export default ClassIndex;
