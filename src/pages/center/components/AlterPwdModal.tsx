import React from 'react';
import { Form, Input, Modal } from 'antd';
import { API } from '@/common/entity/typings';

const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };

interface AlterPwdModalProps {
  onCancel: (flag?: boolean, formVals?: API.CurrentUser) => void;
  onSubmit: (values: API.CurrentUser) => void;
  alterPwdModalVisible: boolean;
};

const AlterPwdModal: React.FC<AlterPwdModalProps> = (props) => {

  const [form] = Form.useForm();
  const {
    onSubmit: handleAlterPwd,
    onCancel: handleAlterPwdModalVisible,
    alterPwdModalVisible
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    handleAlterPwd({ ...fieldsValue });
  };

  return (
    <Modal
      width={640}
      maskClosable={false}
      destroyOnClose
      title="修改密码"
      open={alterPwdModalVisible}
      okText="确定"
      onOk={() => handleNext()}
      onCancel={() => { form.resetFields(); handleAlterPwdModalVisible(false) }}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          password: '',
          confirmPassword: ''
        }}
      >
        <Form.Item
          name="password"
          label="新密码"
          rules={[{ required: true, message: '请输入密码!' }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: '请确认密码!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('输入的两个密码不匹配!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AlterPwdModal;
