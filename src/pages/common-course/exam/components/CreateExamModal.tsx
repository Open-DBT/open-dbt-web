import React, { useState } from 'react';
import { Form, Input, Modal, Button, Radio } from 'antd';
import { API } from '@/common/entity/typings';


const FormItem = Form.Item;
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };

type IProps = {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: API.ExamListRecord) => void;
  createModalVisible?: boolean;
}

const CreateExamModal: React.FC<IProps> = (props) => {

  const [form] = Form.useForm();
  const {
    onSubmit: handleCreate,
    onCancel: handleCreateModalVisible,
    createModalVisible
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    handleCreate({ ...fieldsValue, exerciseSource: exerciseSourceValue });
  };

  const [exerciseSourceValue, setExerciseSourceValue] = useState<number>(0);
  const onChange = (e: any) => {
    setExerciseSourceValue(e.target.value);
  };

  return (
    <Modal
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      destroyOnClose
      title="创建新的作业"
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
          testName: '',
          exerciseSource: 0
        }}
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
      >
        <FormItem name="testName" label="作业名称" rules={[{ required: true, message: '请输入作业名称!' }]}>
          <Input placeholder="输入作业名称" />
        </FormItem>
        {/* <FormItem>
          <FormItem label="题目来源" name="exerciseSource" rules={[{ required: true, message: '请选择题目来源!' }]}>
            <Radio.Group onChange={onChange}>
              <Radio value={0}>本课程题库</Radio>
              <Radio value={1} disabled>公共题库</Radio>
            </Radio.Group>
          </FormItem>
          <div style={{ width: '360px', height: '35px', marginTop: '0px', background: '#FDDF66', borderRadius: '5px', color: '#333333', padding: '8px' }}>
            <img style={{ margin: '-5px 8px 0px 8px' }} src={require('@/img/student/icon-warn.svg')} />
            作业创建后，题目来源将无法更改，请谨慎选择！
          </div>
        </FormItem> */}
      </Form>
    </Modal>
  );
};

export default CreateExamModal;
