import React from 'react';
import { Table, Modal } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import './style.less'
import { API } from '@/common/entity/typings';

interface ModalTableProps {
  onCancel: (flag?: boolean) => void;
  modalVisible: boolean;
  courseId: number;
  examClassId: number;
  name: string;
  code: string;
  dataSource: API.ExamStudentAnswerHistoryRecord[];
};

const StuAnswerSituationModal: React.FC<ModalTableProps> = (props) => {

  const {
    onCancel: setModalVisible,
    modalVisible,
    courseId,
    examClassId,
    name,
    code,
    dataSource
  } = props;

  const columns: ProColumns<API.ExamStudentAnswerHistoryRecord>[] = [
    {
      title: '运行ID',
      dataIndex: 'scoreId',
      align: 'center',
      width: '110px',
      render: (_, record) => {
        if (record.scoreId == -1) {
          return '';
        } else {
          return record.scoreId
        }
      }
    },
    {
      title: '题目ID',
      dataIndex: 'exerciseId',
      align: 'center',
      width: '110px',
      render: (_, record) => {
        return `#${record.exerciseId}`;
      }
    },
    {
      title: '答题结果',
      dataIndex: 'score',
      align: 'center',
      width: '150px',
      render: (_, record) => {
        if (record.exerciseSituation > 0) {
          return <div className='score-div' style={{ backgroundColor: '#00ce9b' }}>正确</div>;
        } else if(record.exerciseSituation == -1){
          return <div className='score-div' style={{ backgroundColor: '#E5E5E5' }}>未作答</div>;
        }else {
          return <div className='score-div' style={{ backgroundColor: '#FF6B6B' }}>错误</div>;
        }
      }
    },
    {
      title: '执行时间',
      dataIndex: 'answerExecuteTime',
      align: 'center',
      width: '120px',
      render: (_, record) => {
        return `${record.answerExecuteTime} ms`;
      }
    },
    {
      title: '代码长度',
      dataIndex: 'answerLength',
      align: 'center',
      width: '110px',
    },
    {
      title: '提交时间',
      dataIndex: 'answerTime',
      align: 'center',
      width: '180px',
    },
  ];

  return (
    <Modal
      className="modal-table"
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      width={850}
      maskClosable={false}
      destroyOnClose
      title={<span className="title-3">答题情况</span>}
      open={modalVisible}
      footer={null}
      onCancel={() => { setModalVisible(false) }}
      wrapClassName="modal-custom"
    >
      <span>学生&nbsp;:&nbsp;<span style={{ fontWeight: 'bold' }}>{name}</span>&nbsp;({code})</span>
      <Table
        style={{ marginTop: '10px' }}
        // size={'small'}
        dataSource={dataSource}
        scroll={{ y: 290 }}
        columns={columns}
        pagination={false}
        rowKey="scoreId"
        onRow={record => {
          return {
            onClick: event => {
              if (record.exerciseSituation != -1) {
                window.open(`/teacher/course/${courseId}/stuExamAnswerView/score/${record.scoreId}`);
              }
            }
          };
        }}
      />
    </Modal>
  );
};

export default StuAnswerSituationModal;
