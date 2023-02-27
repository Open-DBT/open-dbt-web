import React, { useState } from 'react';
import { Modal, message, Button, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryExerciseList } from '@/services/teacher/course/exercise';
import './add.less';
import { API } from '@/common/entity/typings';

interface IProps {
  onSubmit: (ids: number[]) => void;
  onCancel: () => void;
  addModalVisible: boolean;
  courseId: number;
  knowledgeNameEnum: any;
  sceneNameEnum: any;
  selectExerciseId: number[];
}

const AddModal: React.FC<IProps> = (props) => {
  console.log('AddModal props ', props);
  const {
    onSubmit: onSubmit,
    onCancel: handleCreateModalVisible,
    addModalVisible,
    courseId,
    knowledgeNameEnum,
    sceneNameEnum,
    selectExerciseId
  } = props;

  const columns: ProColumns<API.ExerciseRecord>[] = [
    {
      title: '习题ID',
      dataIndex: 'exerciseId',
      search: false,
      hideInTable: false,//是否隐藏
      hideInForm: true,//表格新建是否显示此列
      align: 'center',
      width: 120,
    },
    {
      title: '习题名称',
      dataIndex: 'exerciseName',
      align: 'left',
      search: false,
    },
    {
      title: '关键字',
      dataIndex: 'exerciseDesc',
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '场景',
      dataIndex: 'sceneId',
      align: 'center',
      onFilter: true,
      valueType: 'select',
      valueEnum: sceneNameEnum,
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '知识点',
      dataIndex: 'knowledgeId',
      align: 'center',
      onFilter: true,
      valueType: 'select',
      valueEnum: knowledgeNameEnum,
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '场景名称',
      dataIndex: 'sceneName',
      align: 'center',
      search: false,
      width: 120,
    },
    {
      title: '知识点',
      dataIndex: 'knowledgeNames',
      align: 'center',
      search: false,
      width: 200,
      ellipsis: true,
      render: (dom, record, index, action) => {
        return record.knowledgeNames.map((item, index) => {
          return item + '  ';
        })
      },
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>(selectExerciseId);
  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: number[], selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys)
    },
  };
  const handleNext = async () => {
    onSubmit(selectedRowKeys);
  };

  return (
    <Modal
      className="exercise"
      width={"70%"}
      destroyOnClose
      title="习题列表"
      open={addModalVisible}
      onCancel={() => { handleCreateModalVisible() }}
      okText="添加到作业"
      onOk={() => handleNext()}
    >
      <ProTable
        headerTitle="习题列表"
        rowKey="exerciseId"
        request={(params, sorter, filter) => queryExerciseList({ courseId, ...params, sorter, filter })}
        // dataSource={exerciseList}
        columns={columns}
        options={false}
        search={{ defaultCollapsed: false, collapseRender: false }}
        toolBarRender={false}
        rowSelection={{
          ...rowSelection
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a onClick={() => handleNext()}>添加到作业</a>
            </Space>
          );
        }}
      />
    </Modal>
  )
}

export default AddModal;
