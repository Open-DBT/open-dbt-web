import React, { useRef, useState, useEffect } from 'react';
import { Button, Upload, message, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { queryClassStu, updateClassStu } from '@/services/teacher/clazz/sclass';
import * as XLSX from 'xlsx';

const UserList: React.FC<{}> = (props: any) => {
  console.log('user props ', props)
  const sclassId = props.sclass.id;
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建
  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      align: 'center',
      render: (dom, record, index, action) => {
        return index + 1;
      },
    },
    {
      title: 'userId',
      dataIndex: 'userId',
      search: false,
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '工号/学号',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
    }, 
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
    },
  ];

  const options = {
    density: false,//密度
    fullScreen: false,//最大化
    reload: true, //刷新
    setting: true //设置
  };

  const search = {
    defaultCollapsed: false,
    collapseRender: () => false
  };

  return (
    <>
      <ProTable
        actionRef={actionRef}
        headerTitle="学生列表"
        rowKey="userId"
        request={(params, sorter, filter) => queryClassStu({ sclassId, ...params, sorter, filter })}
        columns={columns}
        options={options}
        search={search}
      />
    </ >
  );
};

export default UserList
