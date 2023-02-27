import React, { useState } from 'react';
import { Form, Switch, Modal } from 'antd';
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };
import moment from 'moment';
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import { Mandarin } from "flatpickr/dist/l10n/zh.js"
import { API } from '@/common/entity/typings';
interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: API.ExamClassListRecord) => void;
  updateModalVisible: boolean;
  values: Partial<API.ExamClassListRecord>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible
  } = props;

  const [formVals] = useState({ ...props.values });

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    if (typeof (fieldsValue.testStart) !== 'string')
      fieldsValue.testStart = moment(fieldsValue.testStart[0]).format('YYYY-MM-DD HH:mm:ss');
    if (typeof (fieldsValue.testEnd) !== 'string')
      fieldsValue.testEnd = moment(fieldsValue.testEnd[0]).format('YYYY-MM-DD HH:mm:ss');
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="发放作业到班级"
      open={updateModalVisible}
      okText="更新"
      onOk={() => handleNext()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{ ...formVals }}
      >
        <Form.Item label="作业名称">
          <span>{formVals.exam?.testName}</span>
        </Form.Item>

        <Form.Item label="班级名称">
          <span>{formVals.sclass?.className}</span>
        </Form.Item>

        <Form.Item label="开始时间" name="testStart" rules={[{ required: true }]}>
          <Flatpickr data-enable-time data-time_24hr options={{ locale: Mandarin }} />
        </Form.Item>
        <Form.Item label="截止时间" name="testEnd" rules={[{ required: true }]}>
          <Flatpickr data-enable-time data-time_24hr options={{ locale: Mandarin }} />
        </Form.Item>
        <Form.Item label="可见状态">
          <Form.Item name="testIsOpen" valuePropName="checked">
            <Switch checkedChildren="可见" unCheckedChildren="隐藏" />
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
