import React from 'react';
import { Table, Modal } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import './less/style.less'
import { API } from '@/common/entity/typings';
interface ModalTableProps {
  onCancel: (flag?: boolean) => void;
  modalVisible: boolean;
  stuName: string;
  stuCode: string;
  dataSource: API.Score[];
};

const StuAnswerSituationModal: React.FC<ModalTableProps> = (props) => {

  const {
    onCancel: setModalVisible,
    modalVisible,
    stuName,
    stuCode,
    dataSource
  } = props;

  const columns: ProColumns<API.Score>[] = [
    {
      title: '运行ID',
      dataIndex: 'scoreId',
      align: 'center',
      width: '100px',
    },
    {
      title: '题目ID',
      dataIndex: 'exerciseId',
      align: 'center',
      width: '100px',
      render: (_, record) => {
        return `#${record.exerciseId}`;
      }
    },
    {
        title: '答题结果',
        dataIndex: 'score',
        align: 'center',
        width: '100px',
        render: (_, record) => {
          if (record.score == 100) {
            return <span style={{ color: '#00ce9b' }}>正确</span>;
          } else {
            return <span style={{ color: '#FF6B6B' }}>错误</span>;
          }
        }
    },
    {
        title: '执行时间',
        dataIndex: 'answerExecuteTime',
        align: 'center',
        width: '100px',
        render: (_, record) => {
          return `${record.answerExecuteTime} ms`;
        }
    },
    {
        title: '代码长度',
        dataIndex: 'answerLength',
        align: 'center',
        width: '100px',
    },
    {
        title: '提交时间',
        dataIndex: 'createTime',
        align: 'center',
        width: '180px',
    },
  ];

  return (
    <Modal
      className="modal-table"
      width={800}
      maskClosable={false}
      destroyOnClose
      title="答题情况"
      open={modalVisible}
      footer={null}
      onCancel={() => { setModalVisible(false) }}
    >
      <p>学生: {stuName} ({stuCode})</p>
      <Table 
        dataSource={dataSource}
        scroll={{ y: 290 }}
        columns={columns} 
        pagination={false} 
        rowKey="scoreId"
        onRow={record => {
          return {
            onClick: event => {
              window.open(`/teacher/stuAnswerView/score/${record.scoreId}`);
            }
          };
        }}
      />
    </Modal>
  );
};

export default StuAnswerSituationModal;
