import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import TreeObject from './components/TreeObject';
import { queryRolePage, updateRole, removeRole, updateRoleResource } from '@/services/system/role';
import { API } from '@/common/entity/typings';

// 添加和更新角色
const handleUpdateRole = async (fields: API.RoleListParams) => {
  const hide = message.loading('正在执行...');
  try {
    const result = await updateRole({ ...fields });
    hide();
    if (!result.success) {
      message.error(result.message);
      return false;
    }
    message.success('保存成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存失败请重试！');
    return false;
  }
};

// 更新角色权限
const modifyRole = async (record: API.RoleListParams) => {
  try {
    const result = await updateRoleResource(record);
    if (result.message) {
      message.error(result.message);
      return false;
    }
    message.success('保存成功');
    return true;
  } catch (error) {
    message.error('保存失败请重试！');
    return false;
  }
};

const RoleList: React.FC<{}> = () => {

  // 删除角色弹窗，之所以方法放到TableList里面，是因为需要调用actionRef
  const deleteRoleModal = (record: API.RoleListItem) => {
    Modal.confirm({
      title: '删除角色',
      content: '确定删除该角色吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteRole(record.roleId),
    });
  };
  // 删除角色
  const deleteRole = async (roleId?: number) => {
    const hide = message.loading('正在删除');
    try {
      const result = await removeRole(roleId);
      hide();
      if (!result.success) {
        message.error(result.message);
        return;
      }
      message.success('删除成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      console.log('error ', error)
    }
  }

  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);//修改
  const [treeModalVisible, handleTreeModalVisible] = useState<boolean>(false);//权限树形菜单
  const [stepFormValues, setStepFormValues] = useState<Partial<API.RoleListItem>>({});
  const [stepTreeValues, setTreeValues] = useState({});
  const columns: ProColumns<API.RoleListItem>[] = [
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
      title: 'roleId',
      dataIndex: 'roleId',
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '是否删除',
      dataIndex: 'isDelete',
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '权限集合',
      dataIndex: 'resourceIds',
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'center',
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'isPredefined',
      align: 'center',
      valueEnum: {
        0: { text: '自定义角色', isPredefined: 0 },
        1: { text: '默认角色', isPredefined: 1 }
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='3' onClick={() => { handleTreeModalVisible(true); setTreeValues(record) }}>权限</a>,
        );
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
        headerTitle="角色列表"
        actionRef={actionRef}
        rowKey="roleId"
        request={(params, sorter, filter) => queryRolePage({ ...params, sorter, filter })}
        columns={columns}
        search={false}
        options={options}
      />
      <CreateForm
        onSubmit={async (value: API.RoleListParams) => {
          const success = await handleUpdateRole(value);
          if (success) {
            handleCreateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleCreateModalVisible(false);
        }}
        createModalVisible={createModalVisible}
      />

      {/* stepFormValues这里必须验证是否为空，不然加载会赋值失败 */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value: API.RoleListParams) => {
            const success = await handleUpdateRole(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
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

      {/* 角色权限树 */}
      {stepTreeValues && Object.keys(stepTreeValues).length ? (
        <TreeObject
          onOk={async () => {
            const success = await modifyRole(stepTreeValues);
            if (success) {
              handleTreeModalVisible(false);
              setTreeValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleTreeModalVisible(false);
            setTreeValues({});
          }}
          treeModalVisible={treeModalVisible}
          values={stepTreeValues}
          setTreeValues={setTreeValues}
        />
      ) : null}
    </>
  );
};

export default RoleList;
