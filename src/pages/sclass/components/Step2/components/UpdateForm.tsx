import React from 'react';
import { Form, Input, Modal } from 'antd';
const FormItem = Form.Item;
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };
import { API } from '@/common/entity/typings';
interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: API.UserListParams) => void;
  onSubmit: (values: API.UserListParams) => void;
  updateModalVisible: boolean;
  values: Partial<API.UserListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {

  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({ ...fieldsValue });
  };

  return (
    <Modal
      width={640}
      destroyOnClose
      title="学生修改"
      open={updateModalVisible}
      okText="修改"
      onOk={() => handleNext()}
      onCancel={() => handleUpdateModalVisible(false)}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          userId: props.values.userId,
          code: props.values.code,
          userName: props.values.userName,
          sex: props.values.sex
        }}
      >
        <FormItem name="userId" hidden={true}><Input /></FormItem>
        <FormItem name="sex" hidden={true}><Input /></FormItem>
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
        </FormItem >
      </Form>
    </Modal>
  );
};

export default UpdateForm;
