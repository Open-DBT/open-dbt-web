import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getExamStudentReportCard, getExamDetailByExamClassId, getStudentExerciseReportCard } from '@/services/teacher/course/exam'
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import AnswerHistoryModal from './AnswerHistoryModal';
import { API } from '@/common/entity/typings';
const ExamReport = (props: any) => {
  const examClassId = props.examClassId;
  const sclassId = props.sclassId;

  const [examDetail, setExamDetail] = useState<API.StudentReportCard>();
  const [examStudentReport, setExamStudentReport] = useState<API.ExamStudentReportCard[]>([]);//学生得分列表
  const [finishCount, setFinishCount] = useState<number>(0);

  useEffect(() => {
    getExamDetailByExamClassId(examClassId).then((result) => {
      if (result.obj) {
        setExamDetail(result.obj);
      }
    });
    getExamStudentReportCard(examClassId).then((result) => {
      if (result.success) {
        setExamStudentReport(result.obj);

        let finishCount: number = 0;
        result.obj.map((item) => {
          if (item.isFinish == 1) {
            finishCount++;
          }
        })
        setFinishCount(finishCount);
      } else {
        message.error("查询失败，" + result.message);
      }
    })
  }, []);

  const openStuAnswerSituationModal = (record: API.ExamStudentReportCard) => {
    getStudentExerciseReportCard(examClassId, record.studentId).then((result) => {
      if (result.success) {
        setDataSource(result.obj);
        setmodalParam({ name: record.studentName, code: record.studentCode, sclassId: sclassId });
        setHistoryModalVisible(true);
      } else {
        message.error(result.message);
      }
    })
  }
  const [historyModalVisible, setHistoryModalVisible] = useState<boolean>();
  const [modalParam, setmodalParam] = useState<{ name: string, code: string, sclassId: number }>();
  const [dataSource, setDataSource] = useState<API.ExamStudentAnswerHistoryRecord[]>([]);

  const columns: ProColumns<API.ExamStudentReportCard>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      align: 'center',
      width: '100px',
      render: (dom, record, index, action) => {
        return index + 1;
      },
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      align: 'center',
    },
    {
      title: '学号',
      dataIndex: 'studentCode',
      align: 'center',
    },
    {
      title: '得分',
      dataIndex: 'studentGrossScore',
      align: 'center',
    },
    {
      title: '是否完成',
      dataIndex: 'isFinish',
      align: 'center',
      render: (dom, record, index, action) => {
        return record.isFinish == 1 ? <span style={{ color: '#23dba7' }}>已完成</span> : <span style={{ color: 'red' }}>未完成</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      search: false,
      width: '250px',
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='1' style={{ marginLeft: '15px' }} onClick={() => openStuAnswerSituationModal(record)}>查看明细</a>,
        )
        return buttons;
      }
    }
  ];
  return (
    <div>
      <div className="title-4">成绩单</div>
      <div className="course-info">
        <h3 className="title-2">作业#{examClassId}：{examDetail?.examName}</h3>
        <h4>
          <span className="title-2">状态：</span>
          {examDetail?.examStatus === 1 ? (
            <span style={{ color: 'red' }}>作业已截止</span>
          ) : (
            <span style={{ color: '#00ce9b' }}>作业进行中</span>
          )}
        </h4>
        <h4>
          <span className="title-2">作业时间：</span>
          {examDetail?.examStart} &nbsp; - &nbsp;{examDetail?.examEnd}
        </h4>
        <h4>
          <span className="title-2">总题目数：</span>{examDetail?.exerciseCount}
          <span className="title-2" style={{ marginLeft: '20px' }}>总分值：</span>{examDetail?.exerciseGrossScore}
          <span className="title-2" style={{ marginLeft: '20px' }}>总人数：</span>{examStudentReport.length}
          <span className="title-2" style={{ marginLeft: '20px' }}>完成作业人数：</span>{finishCount}
        </h4>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: 20, marginTop: '20px', borderRadius: '7px' }}>
        <ProTable
          rowKey="id"
          dataSource={examStudentReport}
          columns={columns}
          search={false}
          toolBarRender={false}
          pagination={false}
        />
      </div>

      {/* 某学生历史答题记录 */}
      {historyModalVisible ? (
        <AnswerHistoryModal
          onCancel={() => {
            setHistoryModalVisible(false);
          }}
          modalVisible={historyModalVisible!}
          dataSource={dataSource}
          {...modalParam!}
        />
      ) : null
      }
    </div>
  );
};
export default ExamReport;
