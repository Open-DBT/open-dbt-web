import React from 'react';
import { Form, Input, Modal, Button } from 'antd';
const FormItem = Form.Item;
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };
import { API } from '@/common/entity/typings';

type IProps = {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: API.CourseDetailRecord) => void;
  createModalVisible?: boolean;
}

const CreateForm: React.FC<IProps> = (props) => {

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
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      destroyOnClose
      title="创建课程模板"
      open={createModalVisible}
      okText="下一步"
      onCancel={() => { form.resetFields(); handleCreateModalVisible(false) }}
      footer={[
        <Button key="back" type="primary" onClick={() => handleNext()}>
          下一步
        </Button>
      ]}
      wrapClassName="modal-custom"
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          courseName: ''
        }}
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
      >
        <FormItem
          name="courseName"
          label="课程名称"
          rules={[
            {
              required: true,
              message: '请输入课程名称',
            },
          ]}
        >
          <Input placeholder="输入课程名称" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
