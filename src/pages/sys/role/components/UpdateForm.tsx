import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
const FormItem = Form.Item;
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };
import { API } from '@/common/entity/typings';
interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: API.RoleListParams) => void;
  onSubmit: (values: API.RoleListParams) => void;
  updateModalVisible: boolean;
  values: Partial<API.RoleListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {

  const [formVals, setFormVals] = useState({
    roleName: props.values.roleName,
    roleDesc: props.values.roleDesc,
    roleId: props.values.roleId
  });

  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  return (
    <Modal
      width={640}
      maskClosable={false}
      destroyOnClose
      title="角色编辑"
      open={updateModalVisible}
      okText="更新"
      onOk={() => handleNext()}
      onCancel={() => handleUpdateModalVisible(false)}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          roleId: formVals.roleId,
          roleName: formVals.roleName,
          roleDesc: formVals.roleDesc,
        }}
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

export default UpdateForm;
