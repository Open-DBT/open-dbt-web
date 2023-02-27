import React from 'react';
import { Form, Input, Modal, Select, Button } from 'antd';
const FormItem = Form.Item;
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };
import { API } from '@/common/entity/typings';
type IProps = {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: API.SclassRecord) => void;
  createModalVisible?: boolean;
  course: API.CourseDetailRecord[];
}

const CreateForm: React.FC<IProps> = (props) => {

  const [form] = Form.useForm();
  const {
    onSubmit: handleCreate,
    onCancel: handleCreateModalVisible,
    createModalVisible,
    course
  } = props;

  const children = [];
  for (let i = 0; i < course.length; i++) {
    children.push(<Select.Option key={course[i].courseId} value={course[i].courseId}>{course[i].courseName}</Select.Option>);
  }
  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    handleCreate({ ...fieldsValue });
  };

  return (
    <Modal
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      destroyOnClose
      title="创建新的班级"
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
          className: ''
        }}
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
      >
        <FormItem name="className" label="班级名称" rules={[{ required: true, message: '请输入班级名称!' }]}>
          <Input placeholder="输入班级名称" />
        </FormItem>
        <FormItem>
          <FormItem label="开班课程" name="courseId" rules={[{ required: true, message: '请选择开班课程!' }]}>
            <Select placeholder="请选择开班课程">
              {children}
            </Select>
          </FormItem>
          <div style={{ width: '360px', height: '35px', marginTop: '0px', background: '#FDDF66', borderRadius: '5px', color: '#333333', padding: '8px' }}>
            <img style={{ margin: '-5px 8px 0px 8px' }} src={require('@/img/student/icon-warn.svg')} />
            班级创建后，开班课程将无法更改，请谨慎选择！
          </div>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
