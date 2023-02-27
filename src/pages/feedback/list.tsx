import React, { useRef, useState, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getFeedbackList } from '@/services/system/feedback';
import ViewModal from './view';
import { API } from '@/common/entity/typings';
const ModuleList: React.FC<{}> = () => {

  const [viewModalVisible, handleViewModalVisible] = useState<boolean>(false);//查看
  const [stepFormValues, setStepFormValues] = useState<Partial<API.FeedbackListRecord>>();

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.FeedbackListRecord>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      align: 'center',
      width: 80,
      render: (dom, record, index, action) => {
        return index + 1;
      },
    },
    {
      title: '学号',
      dataIndex: 'code',
      align: 'center',
      width: 200,
      render: (dom, record, index, action) => {
        return record.user.code;
      },
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
      width: 100,
      render: (dom, record, index, action) => {
        return record.user.userName;
      },
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      width: 200,
    },
    {
      title: '反馈内容',
      dataIndex: 'content',
      align: 'center',
      width: '40%',
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      search: false,
      render: (_, record) => {
        let buttons: any = [];
        buttons.push(
          <a key='1' onClick={() => {
            handleViewModalVisible(true);
            setStepFormValues(record)
          }}>查看</a>,
        )
        return buttons;
      }
    }
  ];

  const options = {
    density: false,//密度
    fullScreen: false,//最大化
    reload: true, //刷新
    setting: true //设置
  };

  return (
    <>
      <ProTable
        headerTitle="意见列表"
        actionRef={actionRef}
        rowKey="id"
        request={(params, sorter, filter) => getFeedbackList({ ...params, sorter, filter })}
        columns={columns}
        options={options}
      />
      <ViewModal
        viewModalVisible={viewModalVisible}
        values={stepFormValues}
        onCancel={() => {
          handleViewModalVisible(false);
        }}
      />
    </>
  );
};

export default ModuleList;