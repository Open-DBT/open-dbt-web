import React, { useRef, useState, useEffect } from 'react';
import { Button, Divider, message, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { queryUser, resetPwd, isStop, addUser } from '@/services/system/user';
import { queryRole } from '@/services/system/role';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { getRoleIds } from './utils'
import { API } from '@/common/entity/typings';

const UserList: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);//修改
  const [roleList, setRoleList] = useState<API.RoleListItem[]>([]);
  const [stepFormValues, setStepFormValues] = useState<Partial<API.UserListItem>>({});
  const [roleNameEnum, setRoleNameEnum] = useState({});
  const columns: ProColumns<API.UserListItem>[] = [
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
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      search: false,
      valueEnum: {
        0: { text: '女', sex: 0 },
        1: { text: '男', sex: 1 }
      }
    },
    {
      title: '角色',
      dataIndex: 'roleId',
      align: 'center',
      render: (dom, record, index, action) => {
        const text = record.roleList.map((item: API.RoleListItem) => {
          return item.roleName + ' ';
        })
        return text;
      },
      onFilter: true,
      valueType: 'select',
      valueEnum: roleNameEnum,
    },
    {
      title: '账号状态',
      dataIndex: 'isStop',//0正常，1暂停
      align: 'center',
      search: false,
      valueEnum: {
        0: { text: '正常', isStop: 0 },
        1: { text: '已停用', isStop: 1 }
      }
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      align: 'center',
      search: false,
    },       
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      search: false,
      render: (_, record) => {
        let buttons: any = [];
        if (record.userName === 'admin') {
          return buttons;
        }
        buttons.push(
          <a key='1' onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record) }}>编辑</a>,
          <Divider key='11' type="vertical" />,
          <a key='2' onClick={() => { handResetPwd(record) }}>重置密码</a>,
          <Divider key='12' type="vertical" />
        )
        if (record.isStop === 0) {
          buttons.push(
            <a key='3' style={{ color: 'red' }} onClick={() => { handIsStop(record, 1) }}>暂停</a>
          )
        } else {
          buttons.push(
            <a key='3' style={{ color: '#4B7902' }} onClick={() => { handIsStop(record, 0) }}>恢复</a>
          )
        }
        return buttons;
      }
    }
  ];

  useEffect(() => {
    getRoleList();
  }, []);

  const getRoleList = async () => {
    const result = await queryRole();
    const valueEnum = {};
    result.data.map((item: API.RoleListItem) => {
      const text = item.roleName;
      valueEnum[item.roleId!] = { text };
    });
    setRoleNameEnum(valueEnum);
    setRoleList(result.data);
  };

  // 重置密码弹窗
  const handResetPwd = (record: API.UserListParams) => {
    Modal.confirm({
      title: `重置密码`,
      content: `确定重置${record.code}密码吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('处理中...');
        try {
          const result = await resetPwd({ userId: record.userId });
          hide();
          if (!result.status) {
            message.warn(result.message);
            return;
          }
          message.success('执行成功');
        } catch (error) {
          hide();
          message.error('执行失败，请重试');
          console.log('error ', error)
        }
      },
    });
  };

  // 暂停/恢复账号
  const handIsStop = (record: API.UserListParams, status: number) => {
    let text;
    if (status === 0) {
      text = '恢复'
    } else {
      text = '暂停'
    }
    Modal.confirm({
      title: `${text}账户`,
      content: `确定${text} ${record.code}吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('处理中...');
        try {
          const result = await isStop({ userId: record.userId, isStop: status });
          hide();
          if (!result.status) {
            message.warn(result.message);
            return;
          }
          message.success('执行成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } catch (error) {
          hide();
          message.error('执行失败，请重试');
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

  return (
    <>
      <ProTable
        actionRef={actionRef}
        headerTitle="用户列表"
        rowKey="userId"
        request={(params, sorter, filter) => queryUser({ ...params, sorter, filter })}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" onClick={() => { handleCreateModalVisible(true) }}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        options={options}
        search={search}
      />

      <CreateForm
        onSubmit={async (value: API.UserListParams) => {
          const result = await addUser(value);
          //提交验证
          if (!result.status) {
            message.warn(result.message);
            return;
          }
          //刷新页面
          handleCreateModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
        onCancel={() => {
          handleCreateModalVisible(false);
        }}
        createModalVisible={createModalVisible}
      // roleList={roleList}
      />

      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value: API.UserListParams) => {
            const result = await addUser(value);
            //提交验证
            if (!result.status) {
              message.warn(result.message);
              return;
            }
            //刷新页面
            handleUpdateModalVisible(false);
            setStepFormValues({});

            if (actionRef.current) {
              actionRef.current.reload();
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
    </>
  );
};

export default UserList
