import React from 'react';
import { Form, Input, Modal } from 'antd';
const FormItem = Form.Item;
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };
import { API } from '@/common/entity/typings';
interface CreateFormProps {
  onCancel: (flag?: boolean, formVals?: API.RoleListParams) => void;
  onSubmit: (values: API.RoleListParams) => void;
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
    handleCreate({ ...fieldsValue });
  };

  return (
    <Modal
      width={640}
      maskClosable={false}
      destroyOnClose
      title="角色创建"
      open={createModalVisible}
      okText="创建"
      onOk={() => handleNext()}
      onCancel={() => { form.resetFields();handleCreateModalVisible()}}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          roleName: '',
          roleDesc: '',
        }}
        preserve={false}
      >
        <FormItem
          name="roleName"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称！' }]}
        >
          <Input placeholder="请输入角色名称" />
        </FormItem>
        <FormItem
          name="roleDesc"
          label="角色描述"
        >
          <Input placeholder="请输入角色描述" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
