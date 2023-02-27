import React from 'react';
import { Form, Input, Modal, Radio, Select } from 'antd';
import { getGroup, getRoleIds } from '../utils'
import { API } from '@/common/entity/typings';
const FormItem = Form.Item;
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };

interface CreateFormProps {
  onCancel: (flag?: boolean, formVals?: API.UserListItem) => void;
  onSubmit: (values: API.UserListItem) => void;
  createModalVisible: boolean;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {

  const [form] = Form.useForm();
  const {
    onSubmit: handleCreate,
    onCancel: handleCreateModalVisible,
    createModalVisible,
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    //分组替换成真实角色id
    fieldsValue.roleIds = getRoleIds(fieldsValue.group)
    handleCreate({ ...fieldsValue });
  };

  return (
    <Modal
      width={640}
      maskClosable={false}
      destroyOnClose
      title="创建用户"
      open={createModalVisible}
      okText="确定"
      onOk={() => handleNext()}
      onCancel={() => { form.resetFields(); handleCreateModalVisible(false) }}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          roleName: '',
          roleDesc: '',
          sex: '1',
          group: '0'
        }}
        preserve={false}
      >
        <FormItem
          name="code"
          label="学号/工号"
          rules={[{ required: true, message: '请输入学号/工号' }]}
        >
          <Input placeholder="请输入学号/工号" />
        </FormItem>
        <FormItem
          name="userName"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入姓名" />
        </FormItem>
        <FormItem
          name="sex"
          label="性别"
        >
          <Radio.Group>
            <Radio value="1">男</Radio>
            <Radio value="0">女</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          name="group"
          label="用户角色"
        >
          <Radio.Group>
            <Radio value="0">课程专家</Radio>
            <Radio value="1">教师</Radio>
            <Radio value="2">学生</Radio>
          </Radio.Group>
        </FormItem>
        {/* <FormItem
          name="roleIds"
          label="用户角色"
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择用户角色"
          >
            {children}
          </Select>
        </FormItem> */}
      </Form>
    </Modal>
  );
};

export default CreateForm;
