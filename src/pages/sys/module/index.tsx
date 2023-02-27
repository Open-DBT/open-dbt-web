import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryModule } from '@/services/system/module';
import { API } from '@/common/entity/typings';
const ModuleList: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.ModuleListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      align: 'center',
      render: (dom, record, index, action) => {
        if (actionRef.current?.pageInfo?.current! > 1) {
          return (actionRef.current?.pageInfo?.current! - 1) * actionRef.current?.pageInfo?.pageSize! + index + 1;
        } else {
          return index + 1;
        }
      },
    },
    {
      title: '上级模块',
      dataIndex: 'parentName',
    },
    {
      title: '模块名称',
      dataIndex: 'resourceName',
    },
    {
      title: '模块key',
      dataIndex: 'resourceKey',
      search: false
    },
    {
      title: '模块描述',
      dataIndex: 'resourceDesc',
      search: false,
    },
    {
      title: '是否停用',
      dataIndex: 'isDelete',
      search: false,
      align: 'center',
      valueEnum: {
        0: { text: '正常', isDelete: 0 },
        1: { text: '停用', isDelete: 1 }
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
      <ProTable
        headerTitle="模块列表"
        actionRef={actionRef}
        rowKey="resourceId"
        request={(params, sorter, filter) => queryModule({ ...params, sorter, filter })}
        columns={columns}
        options={options}
      />
  );
};

export default ModuleList;
