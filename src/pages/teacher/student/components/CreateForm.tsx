import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { updateClassStu } from '@/services/teacher/clazz/sclass';
const FormItem = Form.Item;
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };

interface CreateFormProps {
  sclassId: number;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {

  const [form] = Form.useForm();
  const { sclassId } = props;

  const onSubmit = async () => {
    const fieldsValue = await form.validateFields();
    const result = await updateClassStu({ sclassId, ...fieldsValue });
    if (result.success) {
      message.success("添加成功");
    } else {
      message.error(result.message);
    }
  };

  return (
    <Form {...formLayout} form={form} preserve={false}>
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
      <FormItem wrapperCol={{ ...formLayout.wrapperCol, offset: 7 }}>
        <Button type="primary" onClick={onSubmit}>保存</Button>
      </FormItem>
    </Form>
  );
};

export default CreateForm;
