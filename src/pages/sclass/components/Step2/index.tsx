import React, { useRef, useState } from 'react';
import { Button, Divider, message, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { queryClassStu, deleteSclassStu, batchDelSclassStu } from '@/services/teacher/clazz/sclass';
import { updateCenter } from '@/services/system/user';
import AddStuForm from './components/AddStuForm';
import UpdateForm from './components/UpdateForm';
import { API } from '@/common/entity/typings';
const UserList: React.FC<{}> = (props: any) => {
  const sclassId = props.sclass.id;
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);//修改
  const [stepFormValues, setStepFormValues] = useState<Partial<API.UserListItem>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);


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
      sorter: (a, b) => a.code - b.code,
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
      search: false,
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),           
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      search: false,
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='5' onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record) }}>修改</a>,
          <Divider key='42' type="vertical" />,
          <a key='1' onClick={() => { delSclassStu(record, sclassId) }}>删除</a>,
        )
        return buttons;
      }
    }
  ];

  const delSclassStu = async (record: API.UserListParams, sclassId: string) => {
    Modal.confirm({
      title: `删除`,
      content: `确定从该班级中删除学号为【${record.code}】的学生吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('删除中...');
        try {
          const result = await deleteSclassStu({ userId: record.userId!, sclassId: sclassId });
          if (!result.success) {
            message.error(result.message);
            return;
          }
          hide();
          message.success('删除成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } catch (error) {
          hide();
          message.error('删除失败，请重试');
          console.log('error ', error)
        }
      },
    });
  };

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
  const rowSelection = {
    onChange: (selectedRowKeys: number[], selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys)
    },
  };
  const batchDel = () => {
    if(selectedRowKeys.length === 0){
      message.info('请选择要删除的学生');
      return;
    }
    batchDelSclassStu({ userId: selectedRowKeys, sclassId: sclassId },).then((result) => {
      if (result.success) {
        message.success('删除成功');
        actionRef.current?.reload()
        // 重置到默认值，包括表单
        actionRef.current.reset();
      } else {
        message.error(result.message);
      }
    })
  }


  return (
    <>
      <ProTable
        actionRef={actionRef}
        headerTitle="学生列表"
        rowKey="userId"
        request={(params, sorter, filter) => queryClassStu({ sclassId, ...params, sorter, filter })}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" onClick={() => { handleCreateModalVisible(true) }}>
            <PlusOutlined /> 添加学生
          </Button>,
          <Button type="primary" onClick={() => { batchDel() }}>
            <PlusOutlined /> 批量删除
          </Button>,
        ]}
        options={options}
        rowSelection={{
          ...rowSelection,
        }}        
        search={search}      

      />
      <AddStuForm
        onCancel={() => {
          handleCreateModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
        createModalVisible={createModalVisible}
        sclassId={sclassId}
      />

      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value: API.UserListParams) => {
            const rs = await updateCenter(value);
            if (rs.success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              message.success("修改成功");

              if (actionRef.current) {
                actionRef.current.reload();
              }
            } else {
              message.error(rs.message);
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </ >
  );
};

export default UserList
